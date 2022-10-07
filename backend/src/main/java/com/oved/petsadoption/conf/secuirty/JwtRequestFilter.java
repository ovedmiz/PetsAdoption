package com.oved.petsadoption.conf.secuirty;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oved.petsadoption.conf.appconfig.exception.ApiException;
import com.oved.petsadoption.bl.services.impl.JwtUserDetailsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;

@Component
@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) {
        final String requestTokenHeader = request.getHeader("Authorization");
        String username = null;
        String jwtToken = null;

        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            username = getUserNameFromToken(jwtToken);
        } else {
            log.info("JWT Token does not begin with Bearer String");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.jwtUserDetailsService.loadUserByUsername(username);
            if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {
                userAuthentication(request, userDetails);
            }
        }

        try {
            chain.doFilter(request, response);
        } catch (IOException | ServletException e) {
            log.error("ERROR! " + e.getMessage());
            throw new ApiException(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private void userAuthentication(HttpServletRequest request, UserDetails userDetails) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
    }

    private String getUserNameFromToken(String jwtToken) {
        String username;
        try {
            username = jwtTokenUtil.getUsernameFromToken(jwtToken);
        } catch (IllegalArgumentException e) {
            String unableTokenErr = "ERROR! Unable to get JWT Token";
            log.error(unableTokenErr);
            throw new ApiException(unableTokenErr, HttpStatus.UNAUTHORIZED);
        } catch (ExpiredJwtException e) {
            String tokenExpiredErr = "ERROR! JWT Token has expired";
            log.error(tokenExpiredErr);
            throw new ApiException(tokenExpiredErr, HttpStatus.UNAUTHORIZED);
        }

        return username;
    }
}

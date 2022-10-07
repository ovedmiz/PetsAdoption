package com.oved.petsadoption.bl.services.impl;

import java.util.ArrayList;

import com.oved.petsadoption.conf.appconfig.exception.ApiException;
import com.oved.petsadoption.bl.services.IUserService;
import com.oved.petsadoption.dal.entities.UserEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class JwtUserDetailsService implements UserDetailsService {
    @Autowired
    private IUserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public UserDetails loadUserByUsername(String username) {
       UserEntity user = userService.getUserByEmail(username);

       return new User(user.getEmail(), user.getPassword() , new ArrayList<>());
    }

    public void authenticate(String username, String password) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            String userDisabledErr = "ERROR! user disabled";
            log.error(userDisabledErr);
            throw new ApiException(userDisabledErr, HttpStatus.UNAUTHORIZED);
        } catch (BadCredentialsException e) {
            String invalidPasswordErr = String.format("ERROR! invalid password: %s", password);
            throw new ApiException(invalidPasswordErr, HttpStatus.UNAUTHORIZED);
        }
    }
}
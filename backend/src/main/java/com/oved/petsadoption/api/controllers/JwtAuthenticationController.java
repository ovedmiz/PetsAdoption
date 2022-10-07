package com.oved.petsadoption.api.controllers;

import com.oved.petsadoption.bl.services.IUserService;
import com.oved.petsadoption.dal.entities.UserEntity;
import com.oved.petsadoption.api.models.jwt.JwtRequest;
import com.oved.petsadoption.api.models.jwt.JwtResponse;
import com.oved.petsadoption.conf.secuirty.JwtTokenUtil;
import com.oved.petsadoption.bl.services.impl.JwtUserDetailsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class JwtAuthenticationController {
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private JwtUserDetailsService userDetailsService;
    @Autowired
    private IUserService userService;

    @PostMapping(value = "/authenticate")
    public JwtResponse createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) {
        userDetailsService.authenticate(authenticationRequest.getUserName(), authenticationRequest.getPassword());

        UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUserName());
        UserEntity user =  userService.getUserByEmail(authenticationRequest.getUserName());
        String token = jwtTokenUtil.generateToken(userDetails, user.getId(), user.getFirstName(), user.getLastName());

        log.info(String.format("user with id: %s successfully authenticated. token is: %s", user.getId(), token));

        return new JwtResponse(token);
    }
}
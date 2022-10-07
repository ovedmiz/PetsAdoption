package com.oved.petsadoption.conf.secuirty;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    @Autowired
    private UserDetailsService jwtUserDetailsService;
    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    private static final String AUTHENTICATE_URL = "/authenticate";
    private static final String ANIMAL_URL = "/api/animal/";
    private static final String RANDOM_URL = ANIMAL_URL + "random";
    private static final String CATEGORY_BY_ID_URL = ANIMAL_URL + "category/{categoryId}";
    private static final String ANIMAL_BY_ID_URL = ANIMAL_URL + "id/{animalId}";
    private static final String ALL_CATEGORIES_URL = ANIMAL_URL + "allCategories";
    private static final String FILTER_URL = ANIMAL_URL + "filter/{categoryId}";
    private static final String USER_URL =  "/api/user";
    private static final String FORGOT_PASS_URL = USER_URL + "/forgotPassword";
    private static final String RESET_PASS_URL = USER_URL + "/resetPassword";
    private static final String CONTACT_US_URL = "/api/contactUs";

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(jwtUserDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf().disable().authorizeRequests().antMatchers(AUTHENTICATE_URL,RANDOM_URL, CATEGORY_BY_ID_URL,
                        ANIMAL_BY_ID_URL, ALL_CATEGORIES_URL, FILTER_URL, USER_URL, FORGOT_PASS_URL,
                        RESET_PASS_URL, CONTACT_US_URL).permitAll().anyRequest().authenticated()
                .and().exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().cors();
        httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
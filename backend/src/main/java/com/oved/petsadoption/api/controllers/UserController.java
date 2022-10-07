package com.oved.petsadoption.api.controllers;

import com.oved.petsadoption.api.models.ForgotPasswordModel;
import com.oved.petsadoption.api.models.user.UserForInsertApi;
import com.oved.petsadoption.api.models.ResetPasswordModel;
import com.oved.petsadoption.api.models.user.UserForUpdateApi;
import com.oved.petsadoption.bl.services.IUserService;

import com.oved.petsadoption.dal.entities.UserEntity;
import com.oved.petsadoption.dal.models.UserDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping(path = "api/user")
public class UserController {
    @Autowired
    private IUserService userService;
    @Autowired
    private ModelMapper modelMapper;

    @PostMapping()
    public UserDto addUser(@RequestBody UserForInsertApi newUser) {
        return convertToDto(userService.addUser(newUser));
    }

    @PutMapping("/{userId}")
    public UserDto updateUser(@RequestBody UserForUpdateApi user, @PathVariable Long userId) {
        return convertToDto(userService.updateUser(user, userId));
    }

    @PutMapping("/setPassword/{userId}")
    public void setPassword(@RequestBody ResetPasswordModel userPasswordDetails, @PathVariable Long userId) {
        userService.setPassword(userPasswordDetails, userId);
    }

    @GetMapping("/id/{userId}")
    public UserDto getUserById(@PathVariable Long userId) {
        return convertToDto(userService.getUserById(userId));
    }

    @PostMapping("/forgotPassword")
    public void forgotPassword(@RequestBody ForgotPasswordModel userEmail) {
        userService.ForgotPasswordHandler(userEmail);
    }

    @PutMapping("/resetPassword")
    public void resetPassword(@RequestBody ResetPasswordModel userPasswords) {
        userService.resetPassword(userPasswords);
    }

    private UserDto convertToDto(UserEntity user) {
        return modelMapper.map(user, UserDto.class);
    }
}

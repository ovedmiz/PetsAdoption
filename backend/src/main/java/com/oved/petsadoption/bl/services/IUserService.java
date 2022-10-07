package com.oved.petsadoption.bl.services;

import com.oved.petsadoption.api.models.ForgotPasswordModel;
import com.oved.petsadoption.api.models.user.UserForInsertApi;
import com.oved.petsadoption.api.models.ResetPasswordModel;
import com.oved.petsadoption.api.models.user.UserForUpdateApi;
import com.oved.petsadoption.dal.entities.UserEntity;

public interface IUserService {
    UserEntity addUser(UserForInsertApi newUser);
    UserEntity getUserById(Long userId);
    UserEntity updateUser(UserForUpdateApi user, Long userId);
    UserEntity getUserByEmail(String email);
    void setPassword(ResetPasswordModel userPasswordDetails, Long userId);
    void ForgotPasswordHandler(ForgotPasswordModel userEmail);
    void resetPassword(ResetPasswordModel userPasswords);
}

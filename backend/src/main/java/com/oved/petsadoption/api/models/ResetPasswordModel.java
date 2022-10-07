package com.oved.petsadoption.api.models;

import lombok.Data;

@Data
public class ResetPasswordModel {
    private String currentPassword;
    private String newPassword;
}

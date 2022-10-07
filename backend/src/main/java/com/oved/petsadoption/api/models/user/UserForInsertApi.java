package com.oved.petsadoption.api.models.user;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserForInsertApi {
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String email;
    private String password;
    private String city;
    private String phone;
}

package com.oved.petsadoption.api.models.user;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserForUpdateApi {
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String city;
    private String phone;
}

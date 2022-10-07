package com.oved.petsadoption.dal.models;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private Integer age;
    private LocalDate dob;
    private String email;
    private String city;
    private String phone;
}

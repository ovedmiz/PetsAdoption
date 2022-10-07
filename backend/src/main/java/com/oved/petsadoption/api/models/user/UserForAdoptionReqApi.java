package com.oved.petsadoption.api.models.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserForAdoptionReqApi {
    private String firstName;
    private String lastName;
    private Integer age;
    private String city;
    private String phone;
}

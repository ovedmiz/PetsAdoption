package com.oved.petsadoption.api.models.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UserOwnerApi {
    private Long id;
    private String city;
    private String phone;
}

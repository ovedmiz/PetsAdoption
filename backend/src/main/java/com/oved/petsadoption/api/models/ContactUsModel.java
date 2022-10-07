package com.oved.petsadoption.api.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ContactUsModel {
    private String email;
    private String subject;
    private String body;
}

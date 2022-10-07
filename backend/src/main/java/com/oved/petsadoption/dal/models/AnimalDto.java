package com.oved.petsadoption.dal.models;

import lombok.Data;

@Data
public class AnimalDto {
    private Long id;
    private String name;
    private Integer age;
    private String sex;
    private String breed;
    private byte[] image;
}

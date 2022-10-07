package com.oved.petsadoption.api.models.animal;

import lombok.Data;

@Data
public class AnimalForInsertApi {
    private String name;
    private Integer age;
    private String breed;
    private String sex;
    private String color;
    private String size;
    private String description;
}

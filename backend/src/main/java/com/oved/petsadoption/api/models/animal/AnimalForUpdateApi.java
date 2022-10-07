package com.oved.petsadoption.api.models.animal;

import com.oved.petsadoption.dal.entities.CategoryEntity;
import lombok.Data;


@Data
public class AnimalForUpdateApi {
    private String name;
    private Integer age;
    private String sex;
    private CategoryEntity category;
    private String breed;
    private String color;
    private String size;
    private String description;
}

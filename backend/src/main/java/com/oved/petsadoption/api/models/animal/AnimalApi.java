package com.oved.petsadoption.api.models.animal;

import com.oved.petsadoption.api.models.user.UserOwnerApi;
import com.oved.petsadoption.dal.models.CategoryDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AnimalApi {
    private Long id;
    private String name;
    private Integer age;
    private UserOwnerApi owner;
    private CategoryDto category;
    private String breed;
    private String sex;
    private String color;
    private String size;
    private String description;
    private byte[] image;
}
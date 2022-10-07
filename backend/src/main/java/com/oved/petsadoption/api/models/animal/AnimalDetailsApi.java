package com.oved.petsadoption.api.models.animal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class AnimalDetailsApi {
    private Long id;
    private String name;
}

package com.oved.petsadoption.dal.models;

import com.oved.petsadoption.api.enums.AdoptionRequestStatus;
import com.oved.petsadoption.api.models.animal.AnimalApi;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AdoptionRequestForUserDto {
    private Long id;
    private AnimalApi adoptedAnimal;
    private AdoptionRequestStatus status;
}

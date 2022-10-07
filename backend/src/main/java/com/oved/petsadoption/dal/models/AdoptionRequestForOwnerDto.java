package com.oved.petsadoption.dal.models;

import com.oved.petsadoption.api.enums.AdoptionRequestStatus;
import com.oved.petsadoption.api.models.animal.AnimalDetailsApi;
import com.oved.petsadoption.api.models.user.UserForAdoptionReqApi;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdoptionRequestForOwnerDto {
    private Long id;
    private UserForAdoptionReqApi requestorUser;
    private AnimalDetailsApi adoptedAnimal;
    private AdoptionRequestStatus status;
}

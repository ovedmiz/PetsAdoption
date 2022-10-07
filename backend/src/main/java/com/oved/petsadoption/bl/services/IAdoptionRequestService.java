package com.oved.petsadoption.bl.services;

import com.oved.petsadoption.dal.entities.AdoptionRequestEntity;

import java.util.List;

public interface IAdoptionRequestService {
    void addRequest(Long userId, Long animalId);
    AdoptionRequestEntity getRequestById(Long requestId);
    List<AdoptionRequestEntity> getRequestsByAnimal(Long animalId);
    void setStatus(Long requestId, String newStatus);
    List<AdoptionRequestEntity> getRequestsByRequestorUser(Long requestorUserId);
    void deleteAdoptionRequest(Long requestId);
}

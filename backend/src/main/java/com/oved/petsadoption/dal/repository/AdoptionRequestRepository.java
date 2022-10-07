package com.oved.petsadoption.dal.repository;

import com.oved.petsadoption.dal.entities.AdoptionRequestEntity;
import com.oved.petsadoption.dal.entities.AnimalEntity;
import com.oved.petsadoption.dal.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequestEntity, Long>  {
    List<AdoptionRequestEntity> getAdoptionRequestByAdoptedAnimal(AnimalEntity animal);
    List<AdoptionRequestEntity> getAdoptionRequestByRequestorUser(UserEntity requestorUser);
}

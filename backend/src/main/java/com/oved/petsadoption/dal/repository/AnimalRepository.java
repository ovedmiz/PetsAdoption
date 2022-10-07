package com.oved.petsadoption.dal.repository;

import com.oved.petsadoption.api.enums.AnimalStatus;
import com.oved.petsadoption.dal.entities.AnimalEntity;
import com.oved.petsadoption.dal.entities.CategoryEntity;
import com.oved.petsadoption.dal.entities.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<AnimalEntity, Long>, JpaSpecificationExecutor<AnimalEntity> {
    Page<AnimalEntity> getAnimalsByCategoryAndStatus(CategoryEntity category, AnimalStatus status, Pageable pageRequest);
    List<AnimalEntity> getAnimalByOwner(UserEntity Owner);
    List<AnimalEntity> getAnimalsByStatus(AnimalStatus status);
    Page<AnimalEntity> findAll(Specification<AnimalEntity> specification, Pageable pageRequest);
}

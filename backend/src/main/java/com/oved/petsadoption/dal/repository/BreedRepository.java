package com.oved.petsadoption.dal.repository;

import com.oved.petsadoption.dal.entities.BreedEntity;
import com.oved.petsadoption.dal.entities.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BreedRepository extends JpaRepository<BreedEntity, String> {
    List<BreedEntity> getBreedEntitiesByCategory(CategoryEntity category);
}

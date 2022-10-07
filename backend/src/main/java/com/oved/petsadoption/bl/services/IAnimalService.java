package com.oved.petsadoption.bl.services;

import com.oved.petsadoption.api.models.animal.AnimalForInsertApi;
import com.oved.petsadoption.api.models.animal.AnimalForUpdateApi;
import com.oved.petsadoption.dal.entities.AnimalEntity;
import com.oved.petsadoption.dal.entities.BreedEntity;
import com.oved.petsadoption.dal.entities.CategoryEntity;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IAnimalService {
    AnimalEntity addAnimal(AnimalForInsertApi newAnimal, Long userId, Long categoryId);
    AnimalEntity getAnimalById(Long animalId);
    Page<AnimalEntity> getAnimalByCategory(Long categoryId, int pageNumber, int pageSize);
    List<AnimalEntity> getAnimalsByOwner(Long userId);
    void updateAnimal(AnimalForUpdateApi animalApi, Long animalId);
    List<AnimalEntity> getRandomList();
    List<CategoryEntity> getAllCategories();
    void deleteAnimal(Long animalId);
    Page<AnimalEntity> getAnimalsByFilter(Long categoryId, String search, int pageNumber, int pageSize);
    List<BreedEntity> getBreedsByCategory(Long categoryId);
}
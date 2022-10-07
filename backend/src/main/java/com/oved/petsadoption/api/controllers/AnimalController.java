package com.oved.petsadoption.api.controllers;

import com.oved.petsadoption.api.models.*;
import com.oved.petsadoption.api.models.animal.AnimalApi;
import com.oved.petsadoption.api.models.animal.AnimalDetailsApi;
import com.oved.petsadoption.api.models.animal.AnimalForInsertApi;
import com.oved.petsadoption.api.models.animal.AnimalForUpdateApi;
import com.oved.petsadoption.api.models.user.UserOwnerApi;
import com.oved.petsadoption.bl.services.IAnimalService;
import com.oved.petsadoption.bl.services.IImageService;
import com.oved.petsadoption.dal.entities.AnimalEntity;
import com.oved.petsadoption.dal.entities.BreedEntity;
import com.oved.petsadoption.dal.entities.CategoryEntity;
import com.oved.petsadoption.dal.entities.UserEntity;
import com.oved.petsadoption.dal.models.AnimalDto;
import com.oved.petsadoption.dal.models.CategoryDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping(path = "api/animal")
public class AnimalController {
    @Autowired
    private IAnimalService animalService;
    @Autowired
    private IImageService imageService;
    @Autowired
    private ModelMapper modelMapper;

    @PostMapping("{userId}/{categoryId}")
    public AnimalDetailsApi addAnimal(@RequestBody AnimalForInsertApi newAnimal, @PathVariable Long userId,
                          @PathVariable Long categoryId) {
        AnimalEntity animalEntity =  animalService.addAnimal(newAnimal, userId, categoryId);

        return AnimalDetailsApi.builder()
                .id(animalEntity.getId())
                .name(animalEntity.getName())
                .build();
    }

    @PutMapping("/addImage/{animalId}")
    public void addImage(@PathVariable Long animalId, @RequestParam("imageFile") MultipartFile file) {
        imageService.addImage(animalId, file);
    }

    @GetMapping("/id/{animalId}")
    public AnimalApi getAnimalById(@PathVariable Long animalId) {
        AnimalEntity animal = animalService.getAnimalById(animalId);
        UserEntity owner = animal.getOwner();

        return AnimalApi.builder()
                .id(animalId)
                .name(animal.getName())
                .age(animal.getAge())
                .owner(new UserOwnerApi(animal.getOwner().getId(), owner.getCity(), owner.getPhone()))
                .category(convertCategoryToDto(animal.getCategory()))
                .breed(animal.getBreed())
                .sex(animal.getSex())
                .color(animal.getColor())
                .size(animal.getSize())
                .description(animal.getDescription())
                .image(animal.getImage())
                .build();
    }

    @GetMapping("/random")
    public List<AnimalDto> getRandomList() {
        List<AnimalEntity> randomAnimals = animalService.getRandomList();

        return randomAnimals.stream().map(this::convertAnimalToDto).collect(Collectors.toList());
    }

    @GetMapping("/category/{categoryId}")
    public PageableResponseApi<AnimalDto> getAnimalByCategory(@PathVariable Long categoryId,
                @RequestParam(value = "pageNumber", defaultValue = PageableResponseApi.DEFAULT_PAGE_NUMBER) int pageNumber,
                @RequestParam(value = "pageSize", defaultValue = PageableResponseApi.DEFAULT_PAGE_SIZE) int pageSize) {
        Page<AnimalEntity> animals = animalService.getAnimalByCategory(categoryId, pageNumber, pageSize);
        Page<AnimalDto> animalsDto = animals.map(this::convertAnimalToDto);

        return PageableResponseApi.<AnimalDto>builder()
                .content(animalsDto.getContent())
                .totalPages(animalsDto.getTotalPages())
                .build();
    }

    @GetMapping("/breeds/category/{categoryId}")
    public List<String> getBreedsByCategory(@PathVariable Long categoryId) {
        return animalService.getBreedsByCategory(categoryId).stream().map(BreedEntity::getName)
                .collect(Collectors.toList());
    }

    @GetMapping("/filter/{categoryId}")
    public PageableResponseApi<AnimalDto> getByFilter(@PathVariable Long categoryId , @RequestParam(value = "search") String search,
                 @RequestParam(value = "pageNumber", defaultValue = PageableResponseApi.DEFAULT_PAGE_NUMBER) int pageNumber,
                 @RequestParam(value = "pageSize", defaultValue = PageableResponseApi.DEFAULT_PAGE_SIZE) int pageSize) {
        Page<AnimalEntity> animals = animalService.getAnimalsByFilter(categoryId, search, pageNumber, pageSize);
        Page<AnimalDto> animalsDto = animals.map(this::convertAnimalToDto);

        return PageableResponseApi.<AnimalDto>builder()
                .content(animalsDto.getContent())
                .totalPages(animalsDto.getTotalPages())
                .build();
    }

    @GetMapping("/owner/{userId}")
    public List<AnimalDto> getAnimalsByOwner(@PathVariable Long userId) {
        List<AnimalEntity> animals =  animalService.getAnimalsByOwner(userId);

        return animals.stream().map(this::convertAnimalToDto).collect(Collectors.toList());
    }

    @GetMapping("/allCategories")
    public List<CategoryDto> getAllCategories() {
        return animalService.getAllCategories().stream().map(this::convertCategoryToDto).collect(Collectors.toList());
    }

    @PutMapping("{animalId}")
    public void updateAnimal(@RequestBody AnimalForUpdateApi animalApi, @PathVariable Long animalId) {
        animalService.updateAnimal(animalApi, animalId);
    }

    @DeleteMapping("/{animalId}")
    public void deleteAnimal(@PathVariable Long animalId) {
        animalService.deleteAnimal(animalId);
    }

    private AnimalDto convertAnimalToDto(AnimalEntity animal) {
        return modelMapper.map(animal, AnimalDto.class);
    }

    private CategoryDto convertCategoryToDto(CategoryEntity category) {
        return modelMapper.map(category, CategoryDto.class);
    }
}

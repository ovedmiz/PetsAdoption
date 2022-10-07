package com.oved.petsadoption.api.controllers;

import com.oved.petsadoption.api.models.animal.AnimalApi;
import com.oved.petsadoption.api.models.animal.AnimalDetailsApi;
import com.oved.petsadoption.api.models.user.UserForAdoptionReqApi;
import com.oved.petsadoption.api.models.user.UserOwnerApi;
import com.oved.petsadoption.bl.services.IAdoptionRequestService;
import com.oved.petsadoption.dal.entities.AdoptionRequestEntity;
import com.oved.petsadoption.dal.entities.AnimalEntity;
import com.oved.petsadoption.dal.entities.UserEntity;
import com.oved.petsadoption.dal.models.AdoptionRequestForOwnerDto;
import com.oved.petsadoption.dal.models.AdoptionRequestForUserDto;
import com.oved.petsadoption.dal.models.CategoryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping(path = "api/request")
public class AdoptionRequestController {
    @Autowired
    private IAdoptionRequestService adoptionRequestService;

    @PostMapping("{userId}/{animalId}")
    public void addRequest(@PathVariable Long userId, @PathVariable Long animalId) {
        adoptionRequestService.addRequest(userId, animalId);
    }

    @GetMapping("/animal/{animalId}")
    public List<AdoptionRequestForOwnerDto> getRequestsByAnimal(@PathVariable Long animalId) {
        List<AdoptionRequestEntity> requests = adoptionRequestService.getRequestsByAnimal(animalId);

        return requests.stream()
                .map(singleRequest ->
                {
                    AnimalEntity animal = singleRequest.getAdoptedAnimal();
                    UserEntity user = singleRequest.getRequestorUser();
                    UserForAdoptionReqApi requestorUser = new UserForAdoptionReqApi(user.getFirstName(),
                            user.getLastName(), user.getAge(), user.getCity(), user.getPhone());

                    return AdoptionRequestForOwnerDto.builder()
                            .id(singleRequest.getId())
                            .requestorUser(requestorUser)
                            .adoptedAnimal(new AnimalDetailsApi(animal.getId(), animal.getName()))
                            .status(singleRequest.getStatus())
                            .build();
                }).collect(Collectors.toList());
    }

    @GetMapping("/user/{requestorUserId}")
    public List<AdoptionRequestForUserDto> getRequestsByRequestorUser(@PathVariable Long requestorUserId) {
        List<AdoptionRequestEntity> requests =  adoptionRequestService.getRequestsByRequestorUser(requestorUserId);

        return requests.stream()
                .map(singleRequest ->
                {
                    AnimalApi animalApi = convertToAnimalApi(singleRequest.getAdoptedAnimal());

                    return AdoptionRequestForUserDto.builder()
                            .id(singleRequest.getId())
                            .adoptedAnimal(animalApi)
                            .status(singleRequest.getStatus())
                            .build();
                }).collect(Collectors.toList());
    }

    @PutMapping("/status/{requestId}")
    public void setStatus(@PathVariable Long requestId, @RequestParam String newStatus) {
        adoptionRequestService.setStatus(requestId, newStatus);
    }

    @DeleteMapping("/{requestId}")
    public void deleteAdoptionRequest(@PathVariable Long requestId) {
        adoptionRequestService.deleteAdoptionRequest(requestId);
    }

    private AnimalApi convertToAnimalApi(AnimalEntity animal) {
        UserEntity owner = animal.getOwner();

        return AnimalApi.builder()
                .id(animal.getId())
                .name(animal.getName())
                .age(animal.getAge())
                .owner( new UserOwnerApi(owner.getId(), owner.getCity(), owner.getPhone()))
                .category(new CategoryDto(animal.getCategory().getId(), animal.getCategory().getCategoryName()))
                .breed(animal.getBreed())
                .sex(animal.getSex())
                .color(animal.getColor())
                .size(animal.getSize())
                .description(animal.getDescription())
                .image(animal.getImage())
                .build();
    }
}
package com.oved.petsadoption.bl.services.impl;

import com.oved.petsadoption.bl.services.IImageService;
import com.oved.petsadoption.conf.appconfig.exception.ApiException;
import com.oved.petsadoption.bl.services.IAnimalService;
import com.oved.petsadoption.dal.entities.AnimalEntity;
import com.oved.petsadoption.dal.repository.AnimalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class ImageServiceImpl implements IImageService {
    @Autowired
    private IAnimalService animalService;
    @Autowired
    private AnimalRepository animalRepository;

    public void addImage(Long animalId, MultipartFile file) {
        AnimalEntity animal = animalService.getAnimalById(animalId);
        try {
            animal.setImage(file.getBytes());
        } catch (IOException e) {
            throw new ApiException("ERROR! image cannot saved in animal id: " + animalId, HttpStatus.BAD_REQUEST);
        }

        animalRepository.save(animal);
    }
}

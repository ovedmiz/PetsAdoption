package com.oved.petsadoption.bl.services;

import org.springframework.web.multipart.MultipartFile;

public interface IImageService {
    void addImage(Long animalId, MultipartFile file);
}

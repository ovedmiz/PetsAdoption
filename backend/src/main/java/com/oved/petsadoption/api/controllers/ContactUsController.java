package com.oved.petsadoption.api.controllers;

import com.oved.petsadoption.api.models.ContactUsModel;
import com.oved.petsadoption.bl.services.IContactUsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping(path = "api/contactUs")
public class ContactUsController {
    @Autowired
    IContactUsService contactUsService;

    @PostMapping
    public void sendMail(@RequestBody ContactUsModel mailDetails) {
        contactUsService.sendMail(mailDetails);
    }
}

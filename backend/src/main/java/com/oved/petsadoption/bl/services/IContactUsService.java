package com.oved.petsadoption.bl.services;

import com.oved.petsadoption.api.models.ContactUsModel;

public interface IContactUsService {
    void sendMail(ContactUsModel mailDetails);
}

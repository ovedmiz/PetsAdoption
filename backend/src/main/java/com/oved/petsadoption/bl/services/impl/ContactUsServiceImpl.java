package com.oved.petsadoption.bl.services.impl;

import com.oved.petsadoption.api.models.ContactUsModel;
import com.oved.petsadoption.bl.services.IContactUsService;
import com.oved.petsadoption.bl.utils.StrUtils;
import com.oved.petsadoption.conf.appconfig.exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

@Service
@Slf4j
public class ContactUsServiceImpl implements IContactUsService {
    @Autowired
    SendEmailServiceImpl emailUtils;

    @Value("${spring.mail.username}")
    private String mailAddress;

    @Override
    public void sendMail(ContactUsModel mailDetails) {
        validateMailDetails(mailDetails);

        try {
            emailUtils.sendEmail(mailDetails.getEmail(), mailDetails.getEmail(), mailAddress, mailDetails.getSubject(),
                    mailDetails.getBody());
            log.info(String.format("email is send to support from: %s", mailDetails.getEmail()));
        } catch (MessagingException | UnsupportedEncodingException e) {
            String errMail = String.format("ERROR! cannot sending mail to: %s", mailDetails.getEmail());
            log.error(errMail);
            throw new ApiException(errMail, HttpStatus.BAD_REQUEST);
        }
    }

    private void validateMailDetails(ContactUsModel mailDetails) {
        if(mailDetails == null) {
            log.error("ERROR! the mail object is null in sendMail-ContactUs");
            throw new ApiException("ERROR! the mail json is null.", HttpStatus.BAD_REQUEST);
        }
        if(StrUtils.isBlank(mailDetails.getEmail()) || mailDetails.getSubject() == null ||
                StrUtils.isBlank(mailDetails.getBody())) {
            String nullOrEmptyErr = String.format("ERROR! the fields of mailDetails in sendMail is null or empty: %s", mailDetails);
            log.error(nullOrEmptyErr);
            throw new ApiException(nullOrEmptyErr, HttpStatus.BAD_REQUEST);
        }
    }
}

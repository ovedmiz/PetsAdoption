package com.oved.petsadoption.bl.services;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;

public interface ISendEmailService {
    void sendEmail(String fromEmail, String fromPersonal, String toEmail, String subject, String content)
            throws MessagingException, UnsupportedEncodingException;
}

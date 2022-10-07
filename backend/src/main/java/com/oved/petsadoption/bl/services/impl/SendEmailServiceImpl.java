package com.oved.petsadoption.bl.services.impl;

import com.oved.petsadoption.bl.services.ISendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Service
public class SendEmailServiceImpl implements ISendEmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String fromEmail, String fromPersonal, String toEmail, String subject, String content)
            throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(message);

        messageHelper.setFrom(fromEmail, fromPersonal);
        messageHelper.setTo(toEmail);

        messageHelper.setSubject(subject);
        messageHelper.setText(content, true);

        mailSender.send(message);
    }
}

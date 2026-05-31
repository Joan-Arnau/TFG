package com.promorural.api.core.application.port;

import jakarta.mail.MessagingException;

public interface EmailSender {
    void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException;
}

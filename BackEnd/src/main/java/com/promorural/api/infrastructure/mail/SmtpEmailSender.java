package com.promorural.api.infrastructure.mail;

import com.promorural.api.core.application.port.EmailSender;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmtpEmailSender implements EmailSender {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    public SmtpEmailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            log.error("Error sending email to {}: {}", to, e.getMessage());
            if (e instanceof MessagingException) throw (MessagingException) e;
            throw new RuntimeException(e);
        }
    }
}

package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    private static final String FROM_EMAIL = "babysaranya486@gmail.com"; // ✅ Change this to your verified sender

    /**
     * Sends a plain text email to a given address.
     *
     * @param toEmail recipient's email address
     * @param subject email subject
     * @param body    email content
     */
    public void sendEmail(String toEmail, String subject, String body) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            LOGGER.error("❌ EmailService: 'toEmail' is null or empty. Email not sent.");
            return;
        }

        LOGGER.info("📧 Preparing to send email to: {}", toEmail);
        LOGGER.debug("Subject: {}", subject);
        LOGGER.debug("Body: {}", body);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom(FROM_EMAIL); // ✅ Must match the sender configured in SMTP

            mailSender.send(message);

            LOGGER.info("✅ Email successfully sent to {}", toEmail);
        } catch (MailException ex) {
            LOGGER.error("❌ MailException while sending to {}: {}", toEmail, ex.getMessage(), ex);
        } catch (Exception ex) {
            LOGGER.error("❌ Unexpected exception while sending to {}: {}", toEmail, ex.getMessage(), ex);
        }
    }
}

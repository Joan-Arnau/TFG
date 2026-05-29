package com.promorural.api.core.application.service;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailTemplateService {

    private final TemplateEngine templateEngine;

    public EmailTemplateService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public String renderRegistrationTemplate() {
        Context context = new Context();
        return templateEngine.process("mail/registration", context);
    }

    public String renderPasswordResetTemplate(String resetLink) {
        Context context = new Context();
        context.setVariable("resetLink", resetLink);
        return templateEngine.process("mail/password-reset", context);
    }

    public String renderShopApprovedTemplate(String shopName) {
        Context context = new Context();
        context.setVariable("shopName", shopName);
        return templateEngine.process("mail/shop-approved", context);
    }

    public String renderShopRejectedTemplate(String shopName, String reason) {
        Context context = new Context();
        context.setVariable("shopName", shopName);
        context.setVariable("reason", reason);
        return templateEngine.process("mail/shop-rejected", context);
    }
}

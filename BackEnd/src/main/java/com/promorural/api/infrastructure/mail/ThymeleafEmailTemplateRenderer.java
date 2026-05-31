package com.promorural.api.infrastructure.mail;

import com.promorural.api.core.application.port.EmailTemplateRenderer;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class ThymeleafEmailTemplateRenderer implements EmailTemplateRenderer {

    private final TemplateEngine templateEngine;

    public ThymeleafEmailTemplateRenderer(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @Override
    public String renderRegistrationTemplate() {
        Context context = new Context();
        return templateEngine.process("mail/registration", context);
    }

    @Override
    public String renderPasswordResetTemplate(String resetLink) {
        Context context = new Context();
        context.setVariable("resetLink", resetLink);
        return templateEngine.process("mail/password-reset", context);
    }

    @Override
    public String renderShopApprovedTemplate(String shopName) {
        Context context = new Context();
        context.setVariable("shopName", shopName);
        return templateEngine.process("mail/shop-approved", context);
    }

    @Override
    public String renderShopRejectedTemplate(String shopName, String reason) {
        Context context = new Context();
        context.setVariable("shopName", shopName);
        context.setVariable("reason", reason);
        return templateEngine.process("mail/shop-rejected", context);
    }

    @Override
    public String renderShopSuspendedTemplate(String shopName) {
        Context context = new Context();
        context.setVariable("shopName", shopName);
        return templateEngine.process("mail/shop-suspended", context);
    }
}

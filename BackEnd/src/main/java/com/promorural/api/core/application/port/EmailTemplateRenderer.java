package com.promorural.api.core.application.port;

public interface EmailTemplateRenderer {
    String renderRegistrationTemplate();
    String renderPasswordResetTemplate(String resetLink);
    String renderShopApprovedTemplate(String shopName);
    String renderShopRejectedTemplate(String shopName, String reason);
    String renderShopSuspendedTemplate(String shopName);
}

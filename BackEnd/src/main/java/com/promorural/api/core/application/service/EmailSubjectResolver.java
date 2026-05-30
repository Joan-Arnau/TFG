package com.promorural.api.core.application.service;

import com.promorural.api.core.domain.entity.MunicipalityConfig;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.repository.MunicipalityConfigRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class EmailSubjectResolver {

    private final MunicipalityConfigRepository configRepository;
    
    private static final Set<String> SUPPORTED_LANGS = Set.of("ca", "es", "en");

    private static final Map<EmailType, Map<String, String>> SUBJECTS = Map.of(
        EmailType.REGISTRATION, Map.of(
            "ca", "Registre completat",
            "es", "Registro completado",
            "en", "Registration completed"
        ),
        EmailType.PASSWORD_RESET, Map.of(
            "ca", "Restablir contrasenya",
            "es", "Restablecer contraseña",
            "en", "Reset password"
        ),
        EmailType.SHOP_APPROVED, Map.of(
            "ca", "Comerç aprovat",
            "es", "Comercio aprobado",
            "en", "Shop approved"
        ),
        EmailType.SHOP_REJECTED, Map.of(
            "ca", "Sol·licitud de comerç rebutjada",
            "es", "Solicitud de comercio rechazada",
            "en", "Shop request rejected"
        ),
        EmailType.SHOP_SUSPENDED, Map.of(
            "ca", "Comerç suspès",
            "es", "Comercio suspendido",
            "en", "Shop suspended"
        )
    );

    public EmailSubjectResolver(MunicipalityConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    public String resolveSubject(User user, EmailType type) {
        String lang = resolveLanguage(user);
        Map<String, String> translations = SUBJECTS.get(type);
        if (translations == null) {
            return "";
        }
        return translations.getOrDefault(lang, translations.get("ca"));
    }

    public String resolveLanguage(User user) {
        // 1. Try user's preferred language
        if (user != null && user.getPreferredLanguage() != null) {
            String userLang = user.getPreferredLanguage().toLowerCase();
            if (SUPPORTED_LANGS.contains(userLang)) {
                return userLang;
            }
        }

        // 2. Try municipality config default language
        try {
            MunicipalityConfig config = configRepository.findFirstByOrderByIdAsc().orElse(null);
            if (config != null && config.getDefaultLanguage() != null) {
                String defaultLang = config.getDefaultLanguage().toLowerCase();
                if (SUPPORTED_LANGS.contains(defaultLang)) {
                    return defaultLang;
                }
            }
        } catch (Exception e) {
            // Fallback silently
        }

        // 3. Final fallback
        return "ca";
    }
}

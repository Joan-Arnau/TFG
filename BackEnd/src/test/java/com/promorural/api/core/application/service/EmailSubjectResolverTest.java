package com.promorural.api.core.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.promorural.api.core.domain.entity.MunicipalityConfig;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.repository.MunicipalityConfigRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmailSubjectResolverTest {

    @Mock
    private MunicipalityConfigRepository configRepository;

    @InjectMocks
    private EmailSubjectResolver subjectResolver;

    @Test
    void resolveSubjectWithUserPreferredLanguage() {
        User user = new User();
        user.setPreferredLanguage("es");

        String subject = subjectResolver.resolveSubject(user, EmailType.REGISTRATION);
        assertThat(subject).isEqualTo("Registro completado");

        user.setPreferredLanguage("en");
        subject = subjectResolver.resolveSubject(user, EmailType.PASSWORD_RESET);
        assertThat(subject).isEqualTo("Reset password");

        user.setPreferredLanguage("ca");
        subject = subjectResolver.resolveSubject(user, EmailType.SHOP_APPROVED);
        assertThat(subject).isEqualTo("Comerç aprovat");
    }

    @Test
    void resolveSubjectFallbackToMunicipalityDefaultLanguage() {
        User user = new User();
        user.setPreferredLanguage(null); // No preference

        MunicipalityConfig config = new MunicipalityConfig();
        config.setDefaultLanguage("es");
        when(configRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(config));

        String subject = subjectResolver.resolveSubject(user, EmailType.REGISTRATION);
        assertThat(subject).isEqualTo("Registro completado");
    }

    @Test
    void resolveSubjectFallbackToDefaultCaWhenEverythingElseIsMissing() {
        User user = new User();
        user.setPreferredLanguage(null);

        // Scenario 1: Municipality config is empty
        when(configRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.empty());
        String subject = subjectResolver.resolveSubject(user, EmailType.REGISTRATION);
        assertThat(subject).isEqualTo("Registre completat");

        // Scenario 2: Invalid preferred language and invalid municipal language
        user.setPreferredLanguage("fr");
        MunicipalityConfig config = new MunicipalityConfig();
        config.setDefaultLanguage("de");
        when(configRepository.findFirstByOrderByIdAsc()).thenReturn(Optional.of(config));

        subject = subjectResolver.resolveSubject(user, EmailType.PASSWORD_RESET);
        assertThat(subject).isEqualTo("Restablir contrasenya");
    }
}

package com.promorural.api.core.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.promorural.api.core.application.dto.auth.RegisterRequest;
import com.promorural.api.core.domain.entity.PasswordResetToken;
import com.promorural.api.core.domain.entity.Shop;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.repository.PasswordResetTokenRepository;
import com.promorural.api.core.domain.repository.ShopRepository;
import com.promorural.api.core.domain.repository.UserRepository;
import com.promorural.api.infrastructure.security.JwtService;
import jakarta.mail.MessagingException;
import java.util.Locale;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceEmailTest {

    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtService jwtService;
    @Mock private UserRepository userRepository;
    @Mock private ShopRepository shopRepository;
    @Mock private PasswordResetTokenRepository tokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private EmailService emailService;
    @Mock private EmailTemplateService emailTemplateService;
    @Mock private EmailSubjectResolver emailSubjectResolver;

    @InjectMocks
    private AuthService authService;

    private Locale originalLocale;

    @BeforeEach
    void setUp() {
        originalLocale = LocaleContextHolder.getLocale();
    }

    @AfterEach
    void tearDown() {
        LocaleContextHolder.setLocale(originalLocale);
    }

    @Test
    void registerExtractsLocaleLanguageAndResolvesSubject() throws MessagingException {
        LocaleContextHolder.setLocale(Locale.forLanguageTag("es"));
        
        RegisterRequest request = new RegisterRequest(
            "testuser", "test@example.com", "password", 
            "Test Shop", "Description", "Address", "123456789"
        );

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encoded_pass");
        when(emailTemplateService.renderRegistrationTemplate()).thenReturn("html_content");
        when(emailSubjectResolver.resolveSubject(any(User.class), eq(EmailType.REGISTRATION)))
            .thenReturn("Registro completado");

        authService.register(request);

        // Verify user preferred language is set and saved
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getPreferredLanguage()).isEqualTo("es");

        // Verify shop saved
        verify(shopRepository).save(any(Shop.class));

        // Verify email subject resolved and sent
        verify(emailSubjectResolver).resolveSubject(savedUser, EmailType.REGISTRATION);
        verify(emailService).sendHtmlEmail("test@example.com", "Registro completado", "html_content");
    }

    @Test
    void forgotPasswordResolvesSubject() throws MessagingException {
        String email = "merchant@example.com";
        User user = new User();
        user.setEmail(email);
        user.setPreferredLanguage("en");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(emailTemplateService.renderPasswordResetTemplate(anyString())).thenReturn("reset_html");
        when(emailSubjectResolver.resolveSubject(user, EmailType.PASSWORD_RESET))
            .thenReturn("Reset password");

        authService.forgotPassword(email);

        // Verify old token deleted and new one saved
        verify(tokenRepository).deleteByUser(user);
        verify(tokenRepository).save(any(PasswordResetToken.class));

        // Verify email subject resolved and sent
        verify(emailSubjectResolver).resolveSubject(user, EmailType.PASSWORD_RESET);
        verify(emailService).sendHtmlEmail(email, "Reset password", "reset_html");
    }
}

package com.promorural.api.core.application.service;

import com.promorural.api.core.application.dto.auth.AuthResponse;
import com.promorural.api.core.application.dto.auth.LoginRequest;
import com.promorural.api.core.application.dto.auth.RegisterRequest;
import com.promorural.api.core.domain.entity.*;
import com.promorural.api.core.domain.exception.ConflictException;
import com.promorural.api.core.domain.repository.PasswordResetTokenRepository;
import com.promorural.api.core.domain.repository.ShopRepository;
import com.promorural.api.core.domain.repository.UserRepository;
import com.promorural.api.infrastructure.security.JwtService;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final EmailTemplateService emailTemplateService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.backoffice-base-url}")
    private String backofficeBaseUrl;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            ShopRepository shopRepository,
            PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            EmailTemplateService emailTemplateService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.emailTemplateService = emailTemplateService;
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtService.generateToken(user);
            return new AuthResponse(token, user.getRole().name()); 
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Invalid username or password", e);
        }
    }

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new ConflictException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.ROLE_MERCHANT);
        userRepository.save(user);

        Shop shop = new Shop();
        shop.setName(Map.of("ca", request.shopName(), "es", request.shopName(), "en", request.shopName()));
        shop.setDescription(Map.of("ca", request.shopDescription(), "es", request.shopDescription(), "en", request.shopDescription()));
        shop.setAddress(request.address());
        shop.setPhoneNumber(request.phoneNumber());
        shop.setStatus(ShopStatus.PENDING);
        shop.setOwner(user);
        shopRepository.save(shop);
        
        try {
            String htmlContent = emailTemplateService.renderRegistrationTemplate();
            emailService.sendHtmlEmail(request.email(), "Registre completat", htmlContent);
        } catch (MessagingException e) {
            log.error("Error enviant email de benvinguda: {}", e.getMessage());
            throw new RuntimeException("Failed to send confirmation email", e);
        }
    }

    @Transactional
    public void forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            log.warn("Intent de recuperació de contrasenya per a correu no existent.");
            return;
        }

        User user = userOpt.get();
        
        // Invalidate old tokens
        tokenRepository.deleteByUser(user);

        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        String tokenHash = hashToken(token); 

        PasswordResetToken resetToken = new PasswordResetToken(user, tokenHash, ZonedDateTime.now().plusHours(1));
        tokenRepository.save(resetToken);

        String resetLink = backofficeBaseUrl + "/reset-password?token=" + token;
        
        try {
            String htmlContent = emailTemplateService.renderPasswordResetTemplate(resetLink);
            emailService.sendHtmlEmail(email, "Password Reset", htmlContent);
            log.info("Email de recuperació enviat correctament.");
        } catch (MessagingException e) {
            log.error("Error enviant email de recuperació: {}", e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        String tokenHash = hashToken(token);
        PasswordResetToken resetToken = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (resetToken.isExpired() || resetToken.isUsed()) {
            throw new IllegalArgumentException("Token invalid or expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsedAt(ZonedDateTime.now());
        tokenRepository.save(resetToken);
        log.info("Contrasenya restablerta per a l'usuari ID: {}", user.getId());
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }
}

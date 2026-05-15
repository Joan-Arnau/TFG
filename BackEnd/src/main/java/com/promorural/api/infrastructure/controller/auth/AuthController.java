package com.promorural.api.infrastructure.controller.auth;

import com.promorural.api.core.application.dto.auth.AuthResponse;
import com.promorural.api.core.application.dto.auth.ForgotPasswordRequest;
import com.promorural.api.core.application.dto.auth.LoginRequest;
import com.promorural.api.core.application.dto.auth.RegisterRequest;
import com.promorural.api.core.application.dto.auth.ResetPasswordRequest;
import com.promorural.api.core.application.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.promorural.api.core.application.validation.ValidationGroups;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Validated(ValidationGroups.Create.class) @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(
            @Validated(ValidationGroups.Create.class) @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Validated @RequestBody ForgotPasswordRequest request) {
        if (request != null && request.email() != null) {
            authService.forgotPassword(request.email());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Validated @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.token(), request.newPassword());
        return ResponseEntity.ok().build();
    }
}

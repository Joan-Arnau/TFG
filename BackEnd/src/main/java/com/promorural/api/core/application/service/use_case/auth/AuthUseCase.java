package com.promorural.api.core.application.service.use_case.auth;

import com.promorural.api.core.application.dto.auth.AuthResponse;
import com.promorural.api.core.application.dto.auth.LoginRequest;
import com.promorural.api.core.application.dto.auth.RegisterRequest;
import com.promorural.api.core.application.service.AuthService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthUseCase {

    private final AuthService authService;

    public AuthUseCase(AuthService authService) {
        this.authService = authService;
    }

    public AuthResponse login(LoginRequest request) {
        return authService.login(request);
    }

    public void register(RegisterRequest request) {
        authService.register(request);
    }

    public void forgotPassword(String email) {
        authService.forgotPassword(email);
    }

    public void resetPassword(String token, String newPassword) {
        authService.resetPassword(token, newPassword);
    }
}

package com.promorural.api.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthDtos {
    public record LoginRequest(
            @NotBlank(message = "El nom d'usuari és obligatori") String username,
            @NotBlank(message = "La contrasenya és obligatòria") String password
    ) {}

    public record LoginResponse(String token, String role) {}
}

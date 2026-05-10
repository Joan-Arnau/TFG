package com.promorural.api.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthDtos {
    public record LoginRequest(
            @NotBlank(message = "Username is required") String username,
            @NotBlank(message = "Password is required") String password
    ) {}

    public record RegisterRequest(
            @NotBlank(message = "Username is required") String username,
            @NotBlank(message = "Password is required") String password
    ) {}

    public record LoginResponse(String token, String role) {}
}

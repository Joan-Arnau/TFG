package com.promorural.api.core.application.dto.auth;

public record UserProfileResponse(
    String username,
    String role
) {}

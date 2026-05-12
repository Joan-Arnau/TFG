package com.promorural.api.infrastructure.config;

import java.time.LocalDateTime;

public record ApiError(
        String code,
        String message,
        LocalDateTime timestamp,
        String path
) {}

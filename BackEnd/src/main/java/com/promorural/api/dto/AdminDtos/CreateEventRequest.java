package com.promorural.api.dto.AdminDtos;

import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDate;
import java.util.Map;

public record CreateEventRequest(
        @NotEmpty(message = "Title is required") Map<String, String> title,
        Map<String, String> description,
        Map<String, String> locationText,
        Long categoryId,
        boolean festival,
        LocalDate startsAt,
        LocalDate endsAt,
        Double latitude,
        Double longitude
) {}

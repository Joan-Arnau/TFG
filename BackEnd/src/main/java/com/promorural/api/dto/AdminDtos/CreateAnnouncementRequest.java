package com.promorural.api.dto.AdminDtos;

import jakarta.validation.constraints.NotEmpty;
import java.util.Map;

public record CreateAnnouncementRequest(
        @NotEmpty(message = "Title is required") Map<String, String> title,
        @NotEmpty(message = "Content is required") Map<String, String> content,
        Long categoryId,
        boolean urgent
) {}

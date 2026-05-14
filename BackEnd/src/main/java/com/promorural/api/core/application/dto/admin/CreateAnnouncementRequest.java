package com.promorural.api.core.application.dto.admin;

import com.promorural.api.core.application.validation.ValidationGroups;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record CreateAnnouncementRequest(
        @NotEmpty(message = "Title is required", groups = ValidationGroups.Create.class) Map<String, String> title,
        @NotEmpty(message = "Content is required", groups = ValidationGroups.Create.class) Map<String, String> content,
        @NotNull(message = "CategoryId is required", groups = ValidationGroups.Create.class) Long categoryId,
        boolean urgent
) {}

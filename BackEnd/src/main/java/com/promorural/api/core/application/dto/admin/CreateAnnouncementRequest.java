package com.promorural.api.core.application.dto.admin;

import com.promorural.api.core.application.validation.ValidationGroups;
import com.promorural.api.core.application.validation.ValidI18nMap;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record CreateAnnouncementRequest(
        @ValidI18nMap(max = 150, required = true, groups = ValidationGroups.Create.class) Map<String, String> title,
        @ValidI18nMap(max = 4000, required = true, groups = ValidationGroups.Create.class) Map<String, String> content,
        @NotNull(message = "CategoryId is required", groups = ValidationGroups.Create.class) Long categoryId,
        boolean urgent
) {}

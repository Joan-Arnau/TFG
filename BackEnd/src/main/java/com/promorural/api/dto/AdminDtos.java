package com.promorural.api.dto;

import com.promorural.api.entity.ShopStatus;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;
import java.util.Map;

public class AdminDtos {
    public record UpdateConfigRequest(
            Map<String, String> branding,
            Double latitude,
            Double longitude
    ) {}

    public record CreateAnnouncementRequest(
            @NotNull Map<String, String> title,
            @NotNull Map<String, String> content,
            @NotNull Long categoryId,
            boolean isUrgent
    ) {}

    public record CreateEventRequest(
            @NotNull Map<String, String> title,
            @NotNull Map<String, String> description,
            Map<String, String> locationText,
            @NotNull Long categoryId,
            boolean isFestival,
            @NotNull OffsetDateTime startsAt,
            OffsetDateTime endsAt,
            Double latitude,
            Double longitude
    ) {}

    public record UpdateShopStatusRequest(
            @NotNull ShopStatus status
    ) {}
}

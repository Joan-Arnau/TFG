package com.promorural.api.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

public class PublicDtos {
    public record ConfigResponse(
            String defaultLanguage,
            List<String> supportedLanguages,
            Map<String, String> branding,
            Double latitude,
            Double longitude
    ) {}

    public record CategoryResponse(
            Long id,
            Map<String, String> name,
            String type
    ) {}

    public record ShopResponse(
            Long id,
            Map<String, String> name,
            Map<String, String> description,
            String address,
            String phoneNumber,
            String headerImageUrl,
            CategoryResponse category,
            Double latitude,
            Double longitude
    ) {}

    public record ShopDetailResponse(
            Long id,
            Map<String, String> name,
            Map<String, String> description,
            String address,
            String phoneNumber,
            String headerImageUrl,
            CategoryResponse category,
            Double latitude,
            Double longitude,
            List<PromotionResponse> promotions
    ) {}

    public record PromotionResponse(
            Long id,
            Long shopId,
            Map<String, String> title,
            Map<String, String> description,
            String imageUrl,
            LocalDate startsAt,
            LocalDate endsAt
    ) {}

    public record AnnouncementResponse(
            Long id,
            Map<String, String> title,
            Map<String, String> content,
            CategoryResponse category,
            boolean isUrgent,
            OffsetDateTime publishedAt
    ) {}

    public record EventResponse(
            Long id,
            Map<String, String> title,
            Map<String, String> description,
            Map<String, String> locationText,
            CategoryResponse category,
            boolean isFestival,
            OffsetDateTime startsAt,
            OffsetDateTime endsAt,
            Double latitude,
            Double longitude
    ) {}

    public record PointOfInterestResponse(
            Long id,
            Map<String, String> name,
            Map<String, String> description,
            String imageUrl,
            CategoryResponse category,
            Double latitude,
            Double longitude
    ) {}

    public record ContactResponse(
            Long id,
            Map<String, String> serviceName,
            String phoneNumber,
            String iconName,
            CategoryResponse category
    ) {}
}

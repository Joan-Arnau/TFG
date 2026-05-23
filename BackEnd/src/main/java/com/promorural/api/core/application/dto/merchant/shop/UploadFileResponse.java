package com.promorural.api.core.application.dto.merchant.shop;

import java.time.OffsetDateTime;

public record UploadFileResponse(Long id, String url, OffsetDateTime uploadedAt) {}

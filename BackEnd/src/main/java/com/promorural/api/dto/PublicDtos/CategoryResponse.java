package com.promorural.api.dto.PublicDtos;

import java.util.Map;

public record CategoryResponse(
        Long id,
        Map<String, String> name,
        String type
) {}

package com.promorural.api.dto.AdminDtos;

import java.util.Map;

public record CategoryRequestDto(
    Map<String, String> name,
    String type
) {}

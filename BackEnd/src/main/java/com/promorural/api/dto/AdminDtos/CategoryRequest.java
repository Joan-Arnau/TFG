package com.promorural.api.dto.AdminDtos;

import java.util.Map;

public record CategoryRequest(
    Map<String, String> name,
    String type
) {}

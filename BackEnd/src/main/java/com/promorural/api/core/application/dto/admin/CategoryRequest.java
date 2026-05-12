package com.promorural.api.core.application.dto.admin;

import java.util.Map;

public record CategoryRequest(
    Map<String, String> name,
    String type
) {}

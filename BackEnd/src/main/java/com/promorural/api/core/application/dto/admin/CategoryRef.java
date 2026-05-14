package com.promorural.api.core.application.dto.admin;

import java.util.Map;

public record CategoryRef(
        Long id,
        Map<String, String> name,
        String type
) {}
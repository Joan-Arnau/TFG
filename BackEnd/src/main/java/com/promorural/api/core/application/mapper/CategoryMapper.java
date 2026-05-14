package com.promorural.api.core.application.mapper;

import com.promorural.api.core.application.dto.admin.CategoryAdminResponse;
import com.promorural.api.core.application.dto.admin.CategoryRef;
import com.promorural.api.core.application.dto.guest.CategoryResponse;
import com.promorural.api.core.domain.entity.Category;

public final class CategoryMapper {

    private CategoryMapper() {}

    public static CategoryRef toRef(Category category) {
        if (category == null) return null;
        return new CategoryRef(
                category.getId(),
                category.getName(),
                category.getType().name()
        );
    }

    public static CategoryAdminResponse toAdminResponse(Category category) {
        if (category == null) return null;
        return new CategoryAdminResponse(
                category.getId(),
                category.getName(),
                category.getType().name()
        );
    }

    public static CategoryResponse toGuestResponse(Category category) {
        if (category == null) return null;
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getType().name()
        );
    }
}
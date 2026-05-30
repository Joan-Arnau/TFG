package com.promorural.api.core.application.mapper;

import com.promorural.api.core.application.dto.admin.AnnouncementAdminResponse;
import com.promorural.api.core.domain.entity.Announcement;

public final class AnnouncementMapper {

    private AnnouncementMapper() {}

    public static AnnouncementAdminResponse toAdminResponse(Announcement item) {
        if (item == null) return null;
        return new AnnouncementAdminResponse(
                item.getId(),
                item.getTitle(),
                item.getContent(),
                CategoryMapper.toRef(item.getCategory()),
                item.isUrgent(),
                item.getStatus(),
                item.getPublishedAt()
        );
    }
}
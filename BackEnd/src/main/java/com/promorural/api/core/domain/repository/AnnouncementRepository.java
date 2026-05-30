package com.promorural.api.core.domain.repository;

import com.promorural.api.core.domain.entity.Announcement;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByOrderByPublishedAtDesc();
    long countByCategoryId(Long categoryId);
}

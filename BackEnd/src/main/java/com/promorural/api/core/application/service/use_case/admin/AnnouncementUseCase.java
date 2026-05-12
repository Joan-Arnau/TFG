package com.promorural.api.core.application.service.use_case.admin;

import com.promorural.api.core.application.dto.admin.AnnouncementAdminResponse;
import com.promorural.api.core.application.dto.admin.CreateAnnouncementRequest;
import com.promorural.api.core.application.mapper.AnnouncementMapper;
import com.promorural.api.core.domain.entity.Announcement;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.AnnouncementRepository;
import com.promorural.api.core.domain.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnnouncementUseCase {

    private final AnnouncementRepository announcementRepository;
    private final CategoryRepository categoryRepository;

    public AnnouncementUseCase(AnnouncementRepository announcementRepository,
                                CategoryRepository categoryRepository) {
        this.announcementRepository = announcementRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<AnnouncementAdminResponse> getAll() {
        return announcementRepository.findAllByOrderByPublishedAtDesc().stream()
                .map(AnnouncementMapper::toAdminResponse)
                .collect(Collectors.toList());
    }

    public void create(CreateAnnouncementRequest request) {
        Long categoryId = request.categoryId();
        if (categoryId == null) {
            throw new BadRequestException("CategoryId cannot be null");
        }
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
        Announcement announcement = new Announcement();
        announcement.setTitle(request.title());
        announcement.setContent(request.content());
        announcement.setCategory(category);
        announcement.setUrgent(request.urgent());
        announcementRepository.save(announcement);
    }
}
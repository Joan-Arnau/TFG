package com.promorural.api.core.application.service;

import com.promorural.api.core.application.dto.admin.CategoryAdminResponse;
import com.promorural.api.core.application.dto.admin.CategoryRequest;
import com.promorural.api.core.application.mapper.CategoryMapper;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.CategoryType;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.CategoryRepository;
import com.promorural.api.core.domain.repository.ShopRepository;
import com.promorural.api.core.domain.repository.AnnouncementRepository;
import com.promorural.api.core.domain.repository.ContactRepository;
import com.promorural.api.core.domain.repository.EventRepository;
import com.promorural.api.core.domain.repository.PointOfInterestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ShopRepository shopRepository;
    private final AnnouncementRepository announcementRepository;
    private final ContactRepository contactRepository;
    private final EventRepository eventRepository;
    private final PointOfInterestRepository pointOfInterestRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            ShopRepository shopRepository,
            AnnouncementRepository announcementRepository,
            ContactRepository contactRepository,
            EventRepository eventRepository,
            PointOfInterestRepository pointOfInterestRepository) {
        this.categoryRepository = categoryRepository;
        this.shopRepository = shopRepository;
        this.announcementRepository = announcementRepository;
        this.contactRepository = contactRepository;
        this.eventRepository = eventRepository;
        this.pointOfInterestRepository = pointOfInterestRepository;
    }

    public List<CategoryAdminResponse> getAllCategories(String type) {
        List<Category> categories;
        if (type != null && !type.trim().isEmpty()) {
            try {
                CategoryType categoryType = CategoryType.valueOf(type.toUpperCase());
                categories = categoryRepository.findByType(categoryType);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid category type: " + type);
            }
        } else {
            categories = categoryRepository.findAll();
        }
        return categories.stream()
                .map(CategoryMapper::toAdminResponse)
                .collect(Collectors.toList());
    }

    public CategoryAdminResponse createCategory(CategoryRequest request) {
        if (request.name() == null) {
            throw new BadRequestException("Category name cannot be null");
        }
        if (request.type() == null) {
            throw new BadRequestException("Category type cannot be null");
        }
        
        CategoryType categoryType;
        try {
            categoryType = CategoryType.valueOf(request.type());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid category type: " + request.type());
        }

        Category category = new Category();
        category.setName(request.name());
        category.setType(categoryType);
        
        Category savedCategory = categoryRepository.save(category);
        return CategoryMapper.toAdminResponse(savedCategory);
    }

    public CategoryAdminResponse updateCategory(Long id, CategoryRequest request) {
        if (id == null) {
            throw new BadRequestException("Category ID cannot be null");
        }
        if (request.name() == null) {
            throw new BadRequestException("Category name cannot be null");
        }
        if (request.type() == null) {
            throw new BadRequestException("Category type cannot be null");
        }

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        CategoryType categoryType;
        try {
            categoryType = CategoryType.valueOf(request.type());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid category type: " + request.type());
        }

        category.setName(request.name());
        category.setType(categoryType);

        Category savedCategory = categoryRepository.save(category);
        return CategoryMapper.toAdminResponse(savedCategory);
    }

    public void deleteCategory(Long id) {
        if (id == null) {
            throw new BadRequestException("Category ID cannot be null");
        }
        categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        long shopCount = shopRepository.countByCategoryId(id);
        long announcementCount = announcementRepository.countByCategoryId(id);
        long contactCount = contactRepository.countByCategoryId(id);
        long eventCount = eventRepository.countByCategoryId(id);
        long poiCount = pointOfInterestRepository.countByCategoryId(id);

        if (shopCount > 0 || announcementCount > 0 || contactCount > 0 || eventCount > 0 || poiCount > 0) {
            StringBuilder message = new StringBuilder("Cannot delete category because it is in use by: ");
            boolean first = true;
            if (shopCount > 0) {
                message.append(shopCount).append(" shops");
                first = false;
            }
            if (announcementCount > 0) {
                if (!first) message.append(", ");
                message.append(announcementCount).append(" announcements");
                first = false;
            }
            if (contactCount > 0) {
                if (!first) message.append(", ");
                message.append(contactCount).append(" contacts");
                first = false;
            }
            if (eventCount > 0) {
                if (!first) message.append(", ");
                message.append(eventCount).append(" events");
                first = false;
            }
            if (poiCount > 0) {
                if (!first) message.append(", ");
                message.append(poiCount).append(" points of interest");
            }
            throw new BadRequestException(message.toString());
        }

        categoryRepository.deleteById(id);
    }
}

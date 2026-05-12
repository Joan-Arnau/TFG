package com.promorural.api.core.application.service;

import com.promorural.api.core.application.dto.admin.CategoryAdminResponse;
import com.promorural.api.core.application.dto.admin.CategoryRequest;
import com.promorural.api.core.application.mapper.CategoryMapper;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.CategoryType;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryAdminResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
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
        
        CategoryType categoryType = CategoryType.valueOf(request.type());

        Category category = new Category();
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
        categoryRepository.deleteById(id);
    }
}

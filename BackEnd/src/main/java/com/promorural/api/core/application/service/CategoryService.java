package com.promorural.api.core.application.service;

import com.promorural.api.core.application.dto.admin.CategoryRequest;
import com.promorural.api.core.application.dto.guest.CategoryResponse;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.CategoryType;
import com.promorural.api.core.domain.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = new CategoryMapper(); 
    }

    /**
     * Retrieves all categories, mapped to CategoryResponse DTOs.
     * @return A list of CategoryResponse DTOs.
     */
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new category.
     * @param request The CategoryRequestDto containing category details.
     * @return The created CategoryResponse DTO.
     */
    public CategoryResponse createCategory(CategoryRequest request) {
        if (request.name() == null) {
            throw new IllegalArgumentException("Category name cannot be null");
        }
        if (request.type() == null) {
            throw new IllegalArgumentException("Category type cannot be null");
        }
        
        CategoryType categoryType = CategoryType.valueOf(request.type());

        Category category = new Category();
        category.setName(request.name());
        category.setType(categoryType);
        
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toDto(savedCategory);
    }

    /**
     * Deletes a category by its ID.
     * @param id The ID of the category to delete.
     * @throws RuntimeException if the category is not found or cannot be deleted.
     */
    public void deleteCategory(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
        categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
        categoryRepository.deleteById(id);
    }
    
    private static class CategoryMapper {
        public CategoryResponse toDto(Category category) {
            if (category == null) return null;
            return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getType().name()
            );
        }
    }
}

package com.promorural.api.service;

import com.promorural.api.dto.AdminDtos.CategoryRequestDto;
import com.promorural.api.dto.PublicDtos.CategoryResponse;
import com.promorural.api.entity.Category;
import com.promorural.api.entity.CategoryType;
import com.promorural.api.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
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
    public CategoryResponse createCategory(CategoryRequestDto request) {
        Objects.requireNonNull(request.name(), "Category name cannot be null");
        Objects.requireNonNull(request.type(), "Category type cannot be null");
        
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
        Objects.requireNonNull(id, "Category ID cannot be null");
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

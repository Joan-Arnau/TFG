package com.promorural.api.infrastructure.controller.admin;

import com.promorural.api.core.application.dto.admin.CategoryAdminResponse;
import com.promorural.api.core.application.dto.admin.CategoryRequest;
import com.promorural.api.core.application.service.use_case.admin.CategoryUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.promorural.api.core.application.validation.ValidationGroups;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class CategoryController {

    private final CategoryUseCase categoryUseCase;

    public CategoryController(CategoryUseCase categoryUseCase) {
        this.categoryUseCase = categoryUseCase;
    }

    /**
     * Endpoint to get a complete list of all categories.
     * @return ResponseEntity with a list of CategoryResponse DTOs.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryAdminResponse>> getAllCategories(
            @RequestParam(required = false) String type) {
        List<CategoryAdminResponse> categoriesDto = categoryUseCase.getAllCategories(type);
        return ResponseEntity.ok(categoriesDto);
    }

    /**
     * Endpoint to create a new category.
     * @param request The CategoryRequestDto with the data of the new category.
     * @return ResponseEntity with the created CategoryResponse or an error.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/categories")
    public ResponseEntity<CategoryAdminResponse> createCategory(
            @Validated(ValidationGroups.Create.class) @RequestBody CategoryRequest request) {
        CategoryAdminResponse createdCategoryDto = categoryUseCase.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategoryDto);
    }

    /**
     * Endpoint to update an existing category.
     * @param id The ID of the category to update.
     * @param request The CategoryRequest with the updated data.
     * @return ResponseEntity with the updated CategoryResponse.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryAdminResponse> updateCategory(
            @PathVariable Long id,
            @Validated(ValidationGroups.Update.class) @RequestBody CategoryRequest request) {
        CategoryAdminResponse updatedCategoryDto = categoryUseCase.updateCategory(id, request);
        return ResponseEntity.ok(updatedCategoryDto);
    }

    /**
     * Endpoint to delete a category by ID.
     * @param id The ID of the category to delete.
     * @return ResponseEntity indicating success or error.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryUseCase.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}

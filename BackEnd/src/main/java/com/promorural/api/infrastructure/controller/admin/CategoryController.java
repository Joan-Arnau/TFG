package com.promorural.api.infrastructure.controller.admin;

import com.promorural.api.core.application.dto.admin.CategoryRequest;
import com.promorural.api.core.application.dto.publicapi.CategoryResponse;
import com.promorural.api.core.application.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Endpoint per obtenir un llistat complet de totes les categories.
     * @return ResponseEntity amb una llista de CategoryResponse DTOs.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categoriesDto = categoryService.getAllCategories();
        return ResponseEntity.ok(categoriesDto);
    }

    /**
     * Endpoint per crear una nova categoria.
     * @param request El CategoryRequestDto amb les dades de la nova categoria.
     * @return ResponseEntity amb la CategoryResponse creada o un error.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/categories")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        try {
            CategoryResponse createdCategoryDto = categoryService.createCategory(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategoryDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Endpoint per esborrar una categoria per ID.
     * @param id L'ID de la categoria a esborrar.
     * @return ResponseEntity indicant èxit o error.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

package com.promorural.api.core.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.promorural.api.core.application.dto.admin.CategoryAdminResponse;
import com.promorural.api.core.application.dto.admin.CategoryRequest;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.CategoryType;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.CategoryRepository;
import com.promorural.api.core.application.service.use_case.admin.CategoryUseCase;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryUseCase categoryService;

    @Test
    @SuppressWarnings("null")
    void createCategoryPersistsMappedEntity() {
        Category saved = new Category();
        saved.setName(Map.of("ca", "Botigues"));
        saved.setType(CategoryType.SHOP);
        when(categoryRepository.save(any(Category.class))).thenReturn(Objects.requireNonNull(saved));

        CategoryAdminResponse response = categoryService.createCategory(
                new CategoryRequest(Map.of("ca", "Botigues"), "SHOP"));

        ArgumentCaptor<Category> captor = ArgumentCaptor.forClass(Category.class);
        verify(categoryRepository).save(captor.capture());
        Category captured = Objects.requireNonNull(captor.getValue());
        assertThat(captured.getName()).containsEntry("ca", "Botigues");
        assertThat(captured.getType()).isEqualTo(CategoryType.SHOP);
        assertThat(response.name()).containsEntry("ca", "Botigues");
        assertThat(response.type()).isEqualTo("SHOP");
    }

    @Test
    void createCategoryRejectsMissingName() {
        assertThatThrownBy(() -> categoryService.createCategory(new CategoryRequest(null, "SHOP")))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Category name cannot be null");
    }

    @Test
    void deleteCategoryRejectsMissingResource() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.deleteCategory(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Category not found with ID: 99");
    }
}

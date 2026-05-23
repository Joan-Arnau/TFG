package com.promorural.api.core.application.service.use_case.merchant;

import com.promorural.api.core.application.dto.merchant.shop.ProductImageResponse;
import com.promorural.api.core.application.service.FileStorageService;
import com.promorural.api.core.domain.entity.ProductImage;
import com.promorural.api.core.domain.entity.Shop;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.repository.ProductImageRepository;
import com.promorural.api.core.domain.repository.ShopRepository;
import com.promorural.api.core.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.OffsetDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProductImageUseCaseTest {

    private ShopRepository shopRepository;
    private ProductImageRepository productImageRepository;
    private FileStorageService fileStorageService;
    private UserRepository userRepository;

    private ProductImageUseCase useCase;

    @BeforeEach
    void setUp() {
        shopRepository = Mockito.mock(ShopRepository.class);
        productImageRepository = Mockito.mock(ProductImageRepository.class);
        fileStorageService = Mockito.mock(FileStorageService.class);
        userRepository = Mockito.mock(UserRepository.class);

        useCase = new ProductImageUseCase(shopRepository, productImageRepository, fileStorageService, userRepository);
    }

    @Test
    void upload_savesImageAndReturnsResponse() {
        String username = "merchant1";
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(username, null));

        User user = new User();
        user.setUsername(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        Shop shop = new Shop();
        try { java.lang.reflect.Field idField = Shop.class.getDeclaredField("id"); idField.setAccessible(true); idField.set(shop, 10L); } catch (Exception ignored) {}
        when(shopRepository.findByOwnerUsername(username)).thenReturn(Optional.of(shop));

        MockMultipartFile file = new MockMultipartFile("file", "photo.jpg", "image/jpeg", "data".getBytes());
        when(fileStorageService.storeFile(any(), eq("gallery"))).thenReturn("/uploads/gallery/uuid.jpg");

        ProductImage saved = new ProductImage();
        try { java.lang.reflect.Field idField = ProductImage.class.getDeclaredField("id"); idField.setAccessible(true); idField.set(saved, 42L); } catch (Exception ignored) {}
        saved.setImageUrl("/uploads/gallery/uuid.jpg");
        saved.setUploadedAt(OffsetDateTime.now());
        saved.setShop(shop);

        when(productImageRepository.save(any())).thenReturn(saved);

        ProductImageResponse resp = useCase.upload(file);

        assertThat(resp).isNotNull();
        assertThat(resp.id()).isEqualTo(42L);
        assertThat(resp.imageUrl()).isEqualTo("/uploads/gallery/uuid.jpg");

        verify(productImageRepository, times(1)).save(any());
    }

    @Test
    void delete_throwsWhenImageDoesNotBelongToShop() {
        String username = "merchant2";
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(username, null));

        User user = new User();
        user.setUsername(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        Shop shop = new Shop();
        try { java.lang.reflect.Field idField = Shop.class.getDeclaredField("id"); idField.setAccessible(true); idField.set(shop, 11L); } catch (Exception ignored) {}
        when(shopRepository.findByOwnerUsername(username)).thenReturn(Optional.of(shop));

        Shop otherShop = new Shop();
        try { java.lang.reflect.Field idField = Shop.class.getDeclaredField("id"); idField.setAccessible(true); idField.set(otherShop, 99L); } catch (Exception ignored) {}

        ProductImage image = new ProductImage();
        try { java.lang.reflect.Field idField = ProductImage.class.getDeclaredField("id"); idField.setAccessible(true); idField.set(image, 7L); } catch (Exception ignored) {}
        image.setShop(otherShop);

        when(productImageRepository.findById(7L)).thenReturn(Optional.of(image));

        assertThatThrownBy(() -> useCase.delete(7L)).isInstanceOf(org.springframework.security.access.AccessDeniedException.class);
    }
}

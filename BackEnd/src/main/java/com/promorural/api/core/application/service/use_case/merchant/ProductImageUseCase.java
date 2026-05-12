package com.promorural.api.core.application.service.use_case.merchant;

import com.promorural.api.core.application.dto.merchant.shop.ProductImageResponse;
import com.promorural.api.core.application.service.FileStorageService;
import com.promorural.api.core.domain.entity.ProductImage;
import com.promorural.api.core.domain.entity.Shop;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.ProductImageRepository;
import com.promorural.api.core.domain.repository.ShopRepository;
import com.promorural.api.core.domain.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@Transactional
public class ProductImageUseCase {

    private final ShopRepository shopRepository;
    private final ProductImageRepository productImageRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

    public ProductImageUseCase(ShopRepository shopRepository,
                               ProductImageRepository productImageRepository,
                               FileStorageService fileStorageService,
                               UserRepository userRepository) {
        this.shopRepository = shopRepository;
        this.productImageRepository = productImageRepository;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
    }

    public ProductImageResponse upload(MultipartFile file) throws IOException {
        Shop shop = getCurrentUserShop();
        String imageUrl = fileStorageService.storeFile(file);

        ProductImage image = new ProductImage();
        image.setImageUrl(imageUrl);
        image.setShop(shop);

        ProductImage savedImage = productImageRepository.save(image);
        return mapToResponse(savedImage);
    }

    public void delete(Long imageId) throws IOException {
        Shop shop = getCurrentUserShop();
        if (imageId == null) {
            throw new BadRequestException("Image ID cannot be null");
        }
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with ID: " + imageId));

        if (!image.getShop().getId().equals(shop.getId())) {
            throw new AccessDeniedException("Image does not belong to this merchant's shop.");
        }

        fileStorageService.deleteFile(image.getImageUrl());
        productImageRepository.delete(image);
    }

    private Shop getCurrentUserShop() {
        User currentUser = getCurrentUser();
        return shopRepository.findByOwnerUsername(currentUser.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("Merchant does not have an associated shop."));
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        } else {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found."));
        }
    }

    private ProductImageResponse mapToResponse(ProductImage image) {
        if (image == null) return null;
        return new ProductImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getUploadedAt()
        );
    }
}
package com.promorural.api.core.application.service.use_case.merchant;

import com.promorural.api.core.application.dto.merchant.shop.ProductImageResponse;
import com.promorural.api.core.application.dto.merchant.shop.UploadFileResponse;
import com.promorural.api.core.application.port.FileStoragePort;
import com.promorural.api.core.domain.entity.ProductImage;
import com.promorural.api.core.domain.entity.Shop;
import com.promorural.api.core.domain.entity.UploadFile;
import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.ProductImageRepository;
import com.promorural.api.core.domain.repository.ShopRepository;
import com.promorural.api.core.domain.repository.UploadFileRepository;
import com.promorural.api.core.domain.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.promorural.api.core.application.dto.FileData;

@Service
@Transactional
public class ProductImageUseCase {

    private final ShopRepository shopRepository;
    private final ProductImageRepository productImageRepository;
    private final FileStoragePort fileStorageService;
    private final UserRepository userRepository;
    private final UploadFileRepository uploadFileRepository;

    public ProductImageUseCase(ShopRepository shopRepository,
                               ProductImageRepository productImageRepository,
                               FileStoragePort fileStorageService,
                               UserRepository userRepository,
                               UploadFileRepository uploadFileRepository) {
        this.shopRepository = shopRepository;
        this.productImageRepository = productImageRepository;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.uploadFileRepository = uploadFileRepository;
    }

    public ProductImageResponse upload(FileData file) {
        Shop shop = getCurrentUserShop();
        String imageUrl = fileStorageService.storeFile(file, "gallery");

        ProductImage image = new ProductImage();
        image.setImageUrl(imageUrl);
        image.setShop(shop);

        ProductImage savedImage = productImageRepository.save(image);
        return mapToResponse(savedImage);
    }

    public UploadFileResponse uploadPromotionImage(FileData file) {
        Shop shop = getCurrentUserShop();
        String url = fileStorageService.storeFile(file, "promotions");
        UploadFile uf = new UploadFile();
        uf.setUrl(url);
        uf.setShop(shop);
        UploadFile saved = uploadFileRepository.save(uf);
        return new UploadFileResponse(saved.getId(), saved.getUrl(), saved.getUploadedAt());
    }

    public UploadFileResponse uploadShopHeaderImage(FileData file) {
        Shop shop = getCurrentUserShop();
        String url = fileStorageService.storeFile(file, "shops");
        shop.setHeaderImageUrl(url);
        shopRepository.save(shop);
        UploadFile uf = new UploadFile();
        uf.setUrl(url);
        uf.setShop(shop);
        UploadFile saved = uploadFileRepository.save(uf);
        return new UploadFileResponse(saved.getId(), saved.getUrl(), saved.getUploadedAt());
    }

    public void delete(Long imageId) {
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

    public java.util.List<ProductImageResponse> getMyImages() {
        Shop shop = getCurrentUserShop();
        return productImageRepository.findByShopId(shop.getId()).stream()
                .map(this::mapToResponse)
                .toList();
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

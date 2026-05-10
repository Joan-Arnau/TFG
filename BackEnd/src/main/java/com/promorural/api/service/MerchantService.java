package com.promorural.api.service;

import com.promorural.api.dto.MerchantDtos.PromotionCreateDto;
import com.promorural.api.dto.MerchantDtos.ProductImageResponse;
import com.promorural.api.dto.MerchantDtos.ShopUpdateDto;
import com.promorural.api.dto.PublicDtos.CategoryResponse;
import com.promorural.api.dto.PublicDtos.PromotionResponse;
import com.promorural.api.dto.PublicDtos.ShopResponse;
import com.promorural.api.entity.Category;
import com.promorural.api.entity.Promotion;
import com.promorural.api.entity.ProductImage;
import com.promorural.api.entity.Shop;
import com.promorural.api.entity.User;
import com.promorural.api.repository.ProductImageRepository;
import com.promorural.api.repository.PromotionRepository;
import com.promorural.api.repository.ShopRepository;
import com.promorural.api.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class MerchantService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Value("${app.fileupload.upload-dir}")
    private String uploadDir;

    @Value("${app.fileupload.base-url}")
    private String baseUrl;

    /**
     * Retrieves the shop associated with the authenticated merchant, mapped to ShopResponse DTO.
     * @return ShopResponse DTO representing the shop.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    public ShopResponse getShopForMerchant() {
        return mapToShopResponse(getCurrentUserShop());
    }

    /**
     * Updates the shop details for the authenticated merchant and returns the updated shop as ShopResponse DTO.
     * @param shopUpdateDto The DTO containing updated shop information.
     * @return ShopResponse DTO of the updated shop.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    @Transactional
    public ShopResponse updateShopForMerchant(ShopUpdateDto shopUpdateDto) {
        Shop shop = getCurrentUserShop();
        if (shop == null) {
            throw new EntityNotFoundException("Merchant does not have an associated shop.");
        }

        if (shopUpdateDto.getName() != null) {
            shop.setName(shopUpdateDto.getName());
        }
        if (shopUpdateDto.getDescription() != null) {
            shop.setDescription(shopUpdateDto.getDescription());
        }
        
        if (shopUpdateDto.getAddress() != null) {
            shop.setAddress(shopUpdateDto.getAddress());
        }
        if (shopUpdateDto.getPhoneNumber() != null) {
            shop.setPhoneNumber(shopUpdateDto.getPhoneNumber());
        }
        
        return mapToShopResponse(shopRepository.save(shop));
    }

    /**
     * Retrieves all promotions for the authenticated merchant's shop, mapped to PromotionResponse DTOs.
     * @return A list of PromotionResponse DTOs.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    public List<PromotionResponse> getMerchantPromotions() {
        Shop shop = getCurrentUserShop();

        return promotionRepository.findByShopId(shop.getId()).stream()
                .map(this::mapToPromotionResponse)
                .toList();
    }

    /**
     * Creates a new promotion for the authenticated merchant's shop.
     * @param promotionCreateDto The DTO containing promotion details.
     * @return The created PromotionResponse DTO.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    @Transactional
    public PromotionResponse createMerchantPromotion(PromotionCreateDto promotionCreateDto) {
        Shop shop = getCurrentUserShop();

        Promotion promotion = new Promotion();
        promotion.setTitle(promotionCreateDto.getTitle());
        promotion.setDescription(promotionCreateDto.getDescription());
        
        promotion.setStartsAt(promotionCreateDto.getStartsAt());
        promotion.setEndsAt(promotionCreateDto.getEndsAt());
        promotion.setImageUrl(promotionCreateDto.getImageUrl());
        
        promotion.setShop(shop);

        Promotion savedPromotion = promotionRepository.save(promotion);
        return mapToPromotionResponse(savedPromotion);
    }

    /**
     * Deletes a specific promotion belonging to the authenticated merchant.
     * @param promotionId The ID of the promotion to delete.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     * @throws AccessDeniedException if the promotion does not belong to the merchant.
     * @throws RuntimeException if the promotion is not found.
     */
    @Transactional
    public void deleteMerchantPromotion(Long promotionId) {
        if (promotionId == null) {
            throw new IllegalArgumentException("Promotion ID cannot be null");
        }

        Shop shop = getCurrentUserShop();
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new RuntimeException("Promotion not found."));

        if (!shop.getId().equals(promotion.getShop().getId())) {
            throw new AccessDeniedException("Promotion does not belong to this merchant.");
        }

        promotionRepository.delete(promotion);
    }

    /**
     * Uploads an image for the authenticated merchant's shop.
     * @param file The image file to upload.
     * @return ProductImageResponse DTO of the uploaded image.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     * @throws IOException if there is an error storing the file.
     */
    @Transactional
    public ProductImageResponse uploadImageForShop(MultipartFile file) throws IOException {
        Shop shop = getCurrentUserShop();

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath);

        ProductImage image = new ProductImage();
        image.setImageUrl(baseUrl + "/" + fileName);
        image.setShop(shop);

        ProductImage savedImage = productImageRepository.save(image);
        return mapToProductImageResponse(savedImage);
    }

    /**
     * Deletes an image from the authenticated merchant's shop.
     * @param imageId The ID of the image to delete.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     * @throws AccessDeniedException if the image does not belong to the merchant.
     * @throws RuntimeException if the image is not found or cannot be deleted.
     */
    @Transactional
    public void deleteImageForShop(Long imageId) throws IOException {
        if (imageId == null) {
            throw new IllegalArgumentException("Image ID cannot be null");
        }

        Shop shop = getCurrentUserShop();
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found."));

        if (!shop.getId().equals(image.getShop().getId())) {
            throw new AccessDeniedException("Image does not belong to this merchant's shop.");
        }

        String fileName = image.getImageUrl().substring(baseUrl.length() + 1);
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        Files.deleteIfExists(filePath);

        productImageRepository.delete(image);
    }


    /**
     * Retrieves the shop associated with the current authenticated merchant.
     * @return The Shop entity.
     * @throws IllegalStateException if the merchant does not have an associated shop.
     */
    private Shop getCurrentUserShop() {
        User currentUser = getCurrentUser();
        return shopRepository.findByOwnerUsername(currentUser.getUsername())
                .orElseThrow(() -> new IllegalStateException("Merchant does not have an associated shop."));
    }

    /**
     * Retrieves the current authenticated user.
     * @return The User entity.
     * @throws IllegalStateException if the authentication principal is not of the expected type.
     */
    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        } else {
            if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                String username = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
                return userRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found."));
            } else {
                 throw new IllegalStateException("Authentication principal is not a User or UserDetails object.");
            }
        }
    }
    
    private ShopResponse mapToShopResponse(Shop shop) {
        if (shop == null) return null;
        return new ShopResponse(
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                shop.getAddress(),
                shop.getPhoneNumber(),
                shop.getHeaderImageUrl(),
                mapToCategoryResponse(shop.getCategory()),
                shop.getLocation() != null ? shop.getLocation().getY() : null,
                shop.getLocation() != null ? shop.getLocation().getX() : null
        );
    }

    private PromotionResponse mapToPromotionResponse(Promotion p) {
        if (p == null) return null;
        return new PromotionResponse(
                p.getId(),
                p.getShop().getId(),
                p.getTitle(),
                p.getDescription(),
                p.getImageUrl(),
                p.getStartsAt(),
                p.getEndsAt()
        );
    }
    
    private CategoryResponse mapToCategoryResponse(Category category) {
        if (category == null) return null;
        return new CategoryResponse(category.getId(), category.getName(), category.getType().name());
    }

    private ProductImageResponse mapToProductImageResponse(ProductImage image) {
        if (image == null) return null;
        return new ProductImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getUploadedAt()
        );
    }
}

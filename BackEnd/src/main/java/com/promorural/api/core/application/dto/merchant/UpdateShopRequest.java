package com.promorural.api.core.application.dto.merchant;

import com.promorural.api.core.domain.entity.Shop;
import java.util.Map;
import java.util.Optional;

public record UpdateShopRequest(
    Map<String, String> name,
    Map<String, String> description,
    String address,
    String phoneNumber
) {
    /**
     * Applies non-null fields from this DTO to the given Shop entity.
     */
    public void updateEntity(Shop shop) {
        Optional.ofNullable(name).ifPresent(shop::setName);
        Optional.ofNullable(description).ifPresent(shop::setDescription);
        Optional.ofNullable(address).ifPresent(shop::setAddress);
        Optional.ofNullable(phoneNumber).ifPresent(shop::setPhoneNumber);
    }
}

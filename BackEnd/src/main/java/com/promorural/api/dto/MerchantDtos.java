package com.promorural.api.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

public class MerchantDtos {

    @Data
    @NoArgsConstructor
    public static class ShopUpdateDto {
        private Map<String, String> name; 
        private Map<String, String> description;
        
        private String address;
        private String phoneNumber;
    }

    @Data
    @NoArgsConstructor
    public static class PromotionCreateDto {
        private Map<String, String> title; 
        private Map<String, String> description;
        
        private LocalDate startsAt; 
        private LocalDate endsAt; 
        
        private String imageUrl;
    }

    @Data
    @NoArgsConstructor
    public static class PromotionUpdateDto {
        private Map<String, String> title;
        private Map<String, String> description;
        
        private LocalDate startsAt;
        private LocalDate endsAt;
        
        private String imageUrl;
    }
}

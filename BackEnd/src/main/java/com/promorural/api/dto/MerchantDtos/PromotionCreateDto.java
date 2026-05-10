package com.promorural.api.dto.MerchantDtos;

import java.time.OffsetDateTime;
import java.util.Map;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PromotionCreateDto {
    private Map<String, String> title; 
    private Map<String, String> description;
    
    private OffsetDateTime startsAt;
    private OffsetDateTime endsAt;
    
    private String imageUrl;
}

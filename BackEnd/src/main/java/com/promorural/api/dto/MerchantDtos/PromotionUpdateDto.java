package com.promorural.api.dto.MerchantDtos;

import java.time.LocalDate;
import java.util.Map;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PromotionUpdateDto {
    private Map<String, String> title;
    private Map<String, String> description;
    
    private LocalDate startsAt;
    private LocalDate endsAt;
    
    private String imageUrl;
}

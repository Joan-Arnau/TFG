package com.promorural.api.dto.MerchantDtos;

import java.util.Map;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ShopUpdateDto {
    private Map<String, String> name; 
    private Map<String, String> description;
    
    private String address;
    private String phoneNumber;
}

package com.promorural.api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.promorural.api.core.application.dto.merchant.promotion.PromotionCreateRequest;
import com.promorural.api.core.application.dto.merchant.shop.ShopUpdateRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@org.springframework.test.context.TestPropertySource(properties = {
    "spring.flyway.enabled=false",
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL",
    "spring.datasource.driverClassName=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.datasource.schema=classpath:db/test-h2-schema.sql"
})
public class MerchantControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        // no-op for now; uses in-memory DB configured by test profile
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(username = "merchant", authorities = {"ROLE_MERCHANT"})
    void getMyShopImages_returnsOk() throws Exception {
        mockMvc.perform(get("/api/merchant/my-shop/images"))
                .andExpect(status().isOk());
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(username = "merchant", authorities = {"ROLE_MERCHANT"})
    void getPromotion_byId_returnsNotFoundOrOk() throws Exception {
        // Use id 1 — can be not found in clean DB; expect either 404 or 200. We assert status().is4xxClientError() or isOk.
        mockMvc.perform(get("/api/merchant/promotions/1"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    if (status != 200 && (status < 400 || status >= 500)) {
                        throw new AssertionError("Unexpected status: " + status);
                    }
                });
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(username = "merchant", authorities = {"ROLE_MERCHANT"})
    void putPromotion_updateValidation_returnsBadRequestWhenMissingTitle() throws Exception {
        PromotionCreateRequest req = new PromotionCreateRequest(null, null, OffsetDateTime.now(), OffsetDateTime.now().plusDays(1), null);
        String json = objectMapper.writeValueAsString(req);

        mockMvc.perform(put("/api/merchant/promotions/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    @org.springframework.security.test.context.support.WithMockUser(username = "merchant", authorities = {"ROLE_MERCHANT"})
    void getCategories_returnsOk() throws Exception {
        mockMvc.perform(get("/api/merchant/categories?type=SHOP"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(username = "merchant", authorities = {"ROLE_MERCHANT"})
    void putMyShop_updateValidation_returnsBadRequestWhenPhoneIsInvalid() throws Exception {
        ShopUpdateRequest req = new ShopUpdateRequest(validI18n("Shop"), null, null, "555-ABC", null, null, null);

        mockMvc.perform(put("/api/merchant/my-shop")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "merchant", authorities = {"ROLE_MERCHANT"})
    void putMyShop_updateValidation_returnsBadRequestWhenI18nIsTooLong() throws Exception {
        ShopUpdateRequest req = new ShopUpdateRequest(
                Map.of("ca", "x".repeat(101), "es", "Botiga", "en", "Shop"),
                null,
                null,
                null,
                null,
                null,
                null
        );

        mockMvc.perform(put("/api/merchant/my-shop")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    private Map<String, String> validI18n(String value) {
        return Map.of("ca", value, "es", value, "en", value);
    }
}

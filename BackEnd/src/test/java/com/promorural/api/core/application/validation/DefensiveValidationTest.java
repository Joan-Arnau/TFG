package com.promorural.api.core.application.validation;

import com.promorural.api.core.application.dto.auth.RegisterRequest;
import com.promorural.api.core.application.dto.merchant.shop.ShopUpdateRequest;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.util.Map;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DefensiveValidationTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void register_rejectsInvalidEmailAndTooLongEmail() {
        RegisterRequest request = new RegisterRequest(
                "merchant",
                "x".repeat(101),
                "password123",
                "Shop",
                "Description",
                null,
                null
        );

        assertThat(validator.validate(request, ValidationGroups.Create.class))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("email"));
    }

    @Test
    void shopUpdate_rejectsInvalidCoordinatesAndPhone() {
        ShopUpdateRequest request = new ShopUpdateRequest(
                validI18n("Shop"),
                null,
                null,
                "555-ABC",
                null,
                91.0,
                -181.0
        );

        assertThat(validator.validate(request, ValidationGroups.Update.class))
                .extracting(violation -> violation.getPropertyPath().toString())
                .contains("phoneNumber", "latitude", "longitude");
    }

    @Test
    void shopUpdate_rejectsRequiredI18nWithBlankOrMissingLanguage() {
        ShopUpdateRequest request = new ShopUpdateRequest(
                Map.of("ca", "Botiga", "es", "", "en", "Shop"),
                null,
                null,
                null,
                null,
                null,
                null
        );

        assertThat(validator.validate(request, ValidationGroups.Update.class))
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("name"));
    }

    private Map<String, String> validI18n(String value) {
        return Map.of("ca", value, "es", value, "en", value);
    }
}

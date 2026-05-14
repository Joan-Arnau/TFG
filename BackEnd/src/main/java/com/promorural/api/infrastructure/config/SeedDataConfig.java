package com.promorural.api.infrastructure.config;

import com.promorural.api.core.domain.entity.User;
import com.promorural.api.core.domain.entity.MunicipalityConfig;
import com.promorural.api.core.domain.entity.Role;
import com.promorural.api.core.domain.repository.MunicipalityConfigRepository;
import com.promorural.api.core.domain.repository.UserRepository;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.CategoryType;
import com.promorural.api.core.domain.repository.CategoryRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

@Configuration
public class SeedDataConfig {

    @Bean
    CommandLineRunner seedData(
            MunicipalityConfigRepository municipalityConfigRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            AppProperties appProperties,
            PasswordEncoder passwordEncoder,
            GeometryFactory geometryFactory,
            @Value("${SEED_ADMIN_USERNAME:admin}") String adminUsername,
            @Value("${SEED_ADMIN_PASSWORD:admin1234}") String adminPassword,
            @Value("${SEED_MERCHANT_USERNAME:merchant}") String merchantUsername,
            @Value("${SEED_MERCHANT_PASSWORD:merchant1234}") String merchantPassword
    ) {
        return args -> {
            if (categoryRepository.count() == 0) {
                Category shopCat = new Category();
                Map<String, String> shopCatNames = new HashMap<>();
                shopCatNames.put("ca", "Comerç");
                shopCatNames.put("es", "Comercio");
                shopCatNames.put("en", "Shop");
                shopCat.setName(shopCatNames);
                shopCat.setType(CategoryType.SHOP);
                categoryRepository.save(shopCat);

                Category eventCat = new Category();
                Map<String, String> eventCatNames = new HashMap<>();
                eventCatNames.put("ca", "Cultura");
                eventCatNames.put("es", "Cultura");
                eventCatNames.put("en", "Culture");
                eventCat.setName(eventCatNames);
                eventCat.setType(CategoryType.EVENT);
                categoryRepository.save(eventCat);

                Category annCat = new Category();
                Map<String, String> annCatNames = new HashMap<>();
                annCatNames.put("ca", "General");
                annCatNames.put("es", "General");
                annCatNames.put("en", "General");
                annCat.setName(annCatNames);
                annCat.setType(CategoryType.ANNOUNCEMENT);
                categoryRepository.save(annCat);
            }

            if (municipalityConfigRepository.findFirstByOrderByIdAsc().isEmpty()) {
                MunicipalityConfig config = new MunicipalityConfig();
                config.setDefaultLanguage(appProperties.defaultLanguage());
                config.setSupportedLanguages(appProperties.supportedLanguages());
                Map<String, String> branding = new HashMap<>();
                branding.put("primaryColor", "#2E7D32");
                branding.put("secondaryColor", "#1565C0");
                branding.put("logoUrl", "");
                config.setBranding(branding);
                
                Point center = geometryFactory.createPoint(new Coordinate(1.2345, 41.1234));
                config.setLocation(center);
                
                municipalityConfigRepository.save(config);
            }

            if (userRepository.findByUsername(adminUsername).isEmpty()) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ROLE_ADMIN);
                userRepository.save(admin);
            }

            if (userRepository.findByUsername(merchantUsername).isEmpty()) {
                User merchant = new User();
                merchant.setUsername(merchantUsername);
                merchant.setPassword(passwordEncoder.encode(merchantPassword));
                merchant.setRole(Role.ROLE_MERCHANT);
                userRepository.save(merchant);
            }
        };
    }
}

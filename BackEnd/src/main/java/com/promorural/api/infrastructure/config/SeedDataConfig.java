package com.promorural.api.infrastructure.config;

import com.promorural.api.core.domain.entity.*;
import com.promorural.api.core.domain.repository.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

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
            ShopRepository shopRepository,
            PointOfInterestRepository poiRepository,
            AppProperties appProperties,
            PasswordEncoder passwordEncoder,
            GeometryFactory geometryFactory,
            @Value("${SEED_ADMIN_USERNAME:admin}") String adminUsername,
            @Value("${SEED_ADMIN_PASSWORD:admin1234}") String adminPassword,
            @Value("${SEED_ADMIN_EMAIL:admin@promorural.local}") String adminEmail,
            @Value("${SEED_MERCHANT_USERNAME:merchant}") String merchantUsername,
            @Value("${SEED_MERCHANT_PASSWORD:merchant1234}") String merchantPassword,
            @Value("${SEED_MERCHANT_EMAIL:merchant@promorural.local}") String merchantEmail
    ) {
        return args -> {
            // 1. Categories
            if (categoryRepository.count() == 0) {
                // Shop Categories
                createCategory(categoryRepository, CategoryType.SHOP, 
                    Map.of("ca", "Alimentació", "es", "Alimentación", "en", "Food"));
                createCategory(categoryRepository, CategoryType.SHOP, 
                    Map.of("ca", "Hostaleria", "es", "Hostelería", "en", "Hospitality"));
                createCategory(categoryRepository, CategoryType.SHOP, 
                    Map.of("ca", "Serveis", "es", "Servicios", "en", "Services"));
                
                // POI Categories
                createCategory(categoryRepository, CategoryType.POI, 
                    Map.of("ca", "Monuments", "es", "Monumentos", "en", "Monuments"));
                createCategory(categoryRepository, CategoryType.POI, 
                    Map.of("ca", "Natura", "es", "Naturaleza", "en", "Nature"));

                // Event & Announcement
                createCategory(categoryRepository, CategoryType.EVENT, 
                    Map.of("ca", "Cultura", "es", "Cultura", "en", "Culture"));
                createCategory(categoryRepository, CategoryType.ANNOUNCEMENT, 
                    Map.of("ca", "General", "es", "General", "en", "General"));
            }

            // 2. Municipality Config
            if (municipalityConfigRepository.findFirstByOrderByIdAsc().isEmpty()) {
                MunicipalityConfig config = new MunicipalityConfig();
                config.setDefaultLanguage(appProperties.defaultLanguage());
                config.setSupportedLanguages(appProperties.supportedLanguages());
                
                Map<String, String> branding = new HashMap<>();
                branding.put("primaryColor", "#2E7D32"); // Verd rural
                branding.put("secondaryColor", "#1565C0"); // Blau turisme
                branding.put("logoUrl", "https://via.placeholder.com/200x200?text=Ajuntament");
                config.setBranding(branding);
                
                // Centrat a Reus/Tarragona aprox
                Point center = geometryFactory.createPoint(new Coordinate(1.1033, 41.1561));
                config.setLocation(center);
                
                municipalityConfigRepository.save(config);
            }

            // 3. Admin User
            if (userRepository.findByUsername(adminUsername).isEmpty()) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ROLE_ADMIN);
                userRepository.save(admin);
            }

            // 4. Shops and Merchants
            if (shopRepository.count() == 0) {
                User merchant = userRepository.findByUsername(merchantUsername).orElseGet(() -> {
                    User m = new User();
                    m.setUsername(merchantUsername);
                    m.setEmail(merchantEmail);
                    m.setPassword(passwordEncoder.encode(merchantPassword));
                    m.setRole(Role.ROLE_MERCHANT);
                    return userRepository.save(m);
                });

                List<Category> shopCats = categoryRepository.findByType(CategoryType.SHOP);
                Category foodCat = shopCats.stream().filter(c -> c.getName().get("en").equals("Food")).findFirst().orElse(shopCats.get(0));
                Category hostCat = shopCats.stream().filter(c -> c.getName().get("en").equals("Hospitality")).findFirst().orElse(shopCats.get(0));

                // Shop 1: Cal Fruiter
                createShop(shopRepository, merchant, foodCat, "Cal Fruiter", 
                    "Productes de proximitat i km0.", "Carrer Major, 12", "977123456", 
                    geometryFactory.createPoint(new Coordinate(1.1040, 41.1570)));

                // Shop 2: Restaurant El Racó
                createShop(shopRepository, merchant, hostCat, "Restaurant El Racó", 
                    "Cuina tradicional catalana.", "Plaça de la Vila, 5", "977654321", 
                    geometryFactory.createPoint(new Coordinate(1.1050, 41.1555)));
            }

            // 5. Points of Interest
            if (poiRepository.count() == 0) {
                List<Category> poiCats = categoryRepository.findByType(CategoryType.POI);
                Category monCat = poiCats.stream().filter(c -> c.getName().get("en").equals("Monuments")).findFirst().orElse(poiCats.get(0));
                Category natCat = poiCats.stream().filter(c -> c.getName().get("en").equals("Nature")).findFirst().orElse(poiCats.get(0));

                createPOI(poiRepository, monCat, "Església de Sant Pere", 
                    "Edifici gòtic del segle XVI.", 
                    geometryFactory.createPoint(new Coordinate(1.1060, 41.1565)));

                createPOI(poiRepository, natCat, "Parc del Riu", 
                    "Espai natural per passejar i fer esport.", 
                    geometryFactory.createPoint(new Coordinate(1.1020, 41.1540)));
            }
        };
    }

    private void createCategory(CategoryRepository repo, CategoryType type, Map<String, String> names) {
        Category cat = new Category();
        cat.setName(names);
        cat.setType(type);
        repo.save(cat);
    }

    private void createShop(ShopRepository repo, User owner, Category cat, String name, String desc, String addr, String phone, Point loc) {
        Shop shop = new Shop();
        shop.setName(Map.of("ca", name, "es", name, "en", name));
        shop.setDescription(Map.of("ca", desc, "es", desc, "en", desc));
        shop.setAddress(addr);
        shop.setPhoneNumber(phone);
        shop.setStatus(ShopStatus.APPROVED);
        shop.setOwner(owner);
        shop.setCategory(cat);
        shop.setLocation(loc);
        shop.setHeaderImageUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800"); // Foto de mercat de verdures
        
        List<ProductImage> gallery = new ArrayList<>();
        String[] fruitImages = {
            "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400",
            "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?q=80&w=400",
            "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=400" // Nova foto de tomàquets
        };
        for (int i = 0; i < fruitImages.length; i++) {
            ProductImage img = new ProductImage();
            img.setImageUrl(fruitImages[i]);
            img.setShop(shop);
            gallery.add(img);
        }
        shop.setImages(gallery);
        
        repo.save(shop);
    }

    private void createPOI(PointOfInterestRepository repo, Category cat, String name, String desc, Point loc) {
        PointOfInterest poi = new PointOfInterest();
        poi.setName(Map.of("ca", name, "es", name, "en", name));
        poi.setDescription(Map.of("ca", desc, "es", desc, "en", desc));
        poi.setCategory(cat);
        poi.setLocation(loc);
        poi.setImageUrl("https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800");
        repo.save(poi);
    }
}

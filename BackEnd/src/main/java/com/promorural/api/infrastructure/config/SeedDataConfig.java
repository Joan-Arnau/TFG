package com.promorural.api.infrastructure.config;

import com.promorural.api.core.domain.entity.*;
import com.promorural.api.core.domain.repository.*;
import java.time.OffsetDateTime;
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
            AnnouncementRepository announcementRepository,
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
                branding.put("primaryColor", "#2E7D32");
                branding.put("secondaryColor", "#1565C0");
                branding.put("logoUrl", "https://via.placeholder.com/200x200?text=Ajuntament");
                config.setBranding(branding);
                
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

                createShop(shopRepository, merchant, foodCat, "Cal Fruiter", 
                    "Productes de proximitat i km0.", "Carrer Major, 12", "977123456", 
                    geometryFactory.createPoint(new Coordinate(1.1040, 41.1570)));

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

            // 6. Announcements
            if (announcementRepository.count() == 0) {
                List<Category> annCats = categoryRepository.findByType(CategoryType.ANNOUNCEMENT);
                Category generalCat = annCats.isEmpty() ? null : annCats.get(0);

                if (generalCat != null) {
                    createAnnouncement(announcementRepository, generalCat, true,
                        Map.of("ca", "Obres de millora al Carrer Major", "es", "Obras de mejora en la Calle Mayor", "en", "Construction works on Carrer Major"),
                        Map.of("ca", "Informem que a partir del dilluns 3 de juny s'iniciaran les obres de millora de la xarxa d'aigües al Carrer Major. Es preveu una durada d'aproximadament 3 setmanes. Disculpeu les molèsties.", "es", "Informamos que a partir del lunes 3 de junio se iniciarán las obras de mejora de la red de aguas en la Calle Mayor. Se prevé una duración de aproximadamente 3 semanas. Disculpen las molestias.", "en", "We inform that starting Monday June 3, improvement works on the water supply network will begin on Carrer Major. Expected duration is approximately 3 weeks. We apologize for the inconvenience."),
                        OffsetDateTime.now().minusDays(1));

                    createAnnouncement(announcementRepository, generalCat, false,
                        Map.of("ca", "Nova edició de la Fira de l'Art", "es", "Nueva edición de la Feria del Arte", "en", "New edition of the Art Fair"),
                        Map.of("ca", "El proper cap de setmana tindrà lloc la tradicional Fira de l'Art al Centre Cultural. Hi haurà exposicions, tallers i activitats per a tota la família.", "es", "El próximo fin de semana tendrá lugar la tradicional Feria del Arte en el Centro Cultural. Habrá exposiciones, talleres y actividades para toda la familia.", "en", "Next weekend the traditional Art Fair will take place at the Cultural Center. There will be exhibitions, workshops and activities for the whole family."),
                        OffsetDateTime.now().minusDays(7));

                    createAnnouncement(announcementRepository, generalCat, false,
                        Map.of("ca", "Horari d'estiu de la Biblioteca Municipal", "es", "Horario de verano de la Biblioteca Municipal", "en", "Summer opening hours of the Municipal Library"),
                        Map.of("ca", "La Biblioteca Municipal amplia l'horari d'estiu a partir del 15 de juny. Obrirà de dilluns a divendres de 9:00 a 20:00h.", "es", "La Biblioteca Municipal amplía el horario de verano a partir del 15 de junio. Abrirá de lunes a viernes de 9:00 a 20:00h.", "en", "The Municipal Library extends its summer opening hours from June 15. It will be open Monday to Friday from 9:00 AM to 8:00 PM."),
                        OffsetDateTime.now().minusDays(14));
                }
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
        shop.setHeaderImageUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800");
        
        List<ProductImage> gallery = new ArrayList<>();
        String[] fruitImages = {
            "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400",
            "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?q=80&w=400",
            "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=400"
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

    private void createAnnouncement(AnnouncementRepository repo, Category cat, boolean urgent, Map<String, String> title, Map<String, String> content, OffsetDateTime publishedAt) {
        Announcement announcement = new Announcement();
        announcement.setTitle(title);
        announcement.setContent(content);
        announcement.setCategory(cat);
        announcement.setUrgent(urgent);
        announcement.setPublishedAt(publishedAt);
        repo.save(announcement);
    }
}
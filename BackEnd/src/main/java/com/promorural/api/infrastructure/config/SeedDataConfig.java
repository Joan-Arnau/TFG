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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class SeedDataConfig {

    private static final Logger log = LoggerFactory.getLogger(SeedDataConfig.class);

    @Bean
    CommandLineRunner seedData(
            MunicipalityConfigRepository municipalityConfigRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ShopRepository shopRepository,
            PointOfInterestRepository poiRepository,
            AnnouncementRepository announcementRepository,
            EventRepository eventRepository,
            ContactRepository contactRepository,
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
            log.info("Starting database seeding process...");

            // 1. Categories
            if (categoryRepository.count() == 0) {
                log.info("Seeding categories...");
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

                // Contact Categories
                createCategory(categoryRepository, CategoryType.CONTACT, 
                    Map.of("ca", "Emergències", "es", "Emergencias", "en", "Emergencies"));
                createCategory(categoryRepository, CategoryType.CONTACT, 
                    Map.of("ca", "Administració", "es", "Administración", "en", "Administration"));
                createCategory(categoryRepository, CategoryType.CONTACT, 
                    Map.of("ca", "Salut", "es", "Salud", "en", "Health"));
                log.info("Categories seeded successfully.");
            }

            // 2. Municipality Config
            if (municipalityConfigRepository.findFirstByOrderByIdAsc().isEmpty()) {
                log.info("Seeding municipality configuration...");
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
                log.info("Municipality configuration seeded.");
            }

            // 3. Admin User
            if (userRepository.findByUsername(adminUsername).isEmpty()) {
                log.info("Seeding admin user...");
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ROLE_ADMIN);
                userRepository.save(admin);
                log.info("Admin user created.");
            }

            // 4. Shops and Merchants
            if (shopRepository.count() == 0) {
                log.info("Seeding merchants and shops...");
                User merchant1 = userRepository.findByUsername(merchantUsername).orElseGet(() -> {
                    User m = new User();
                    m.setUsername(merchantUsername);
                    m.setEmail(merchantEmail);
                    m.setPassword(passwordEncoder.encode(merchantPassword));
                    m.setRole(Role.ROLE_MERCHANT);
                    return userRepository.save(m);
                });

                User merchant2 = userRepository.findByUsername("merchant2").orElseGet(() -> {
                    User m = new User();
                    m.setUsername("merchant2");
                    m.setEmail("merchant2@promorural.local");
                    m.setPassword(passwordEncoder.encode("merchant1234"));
                    m.setRole(Role.ROLE_MERCHANT);
                    return userRepository.save(m);
                });

                User merchant3 = userRepository.findByUsername("merchant3").orElseGet(() -> {
                    User m = new User();
                    m.setUsername("merchant3");
                    m.setEmail("merchant3@promorural.local");
                    m.setPassword(passwordEncoder.encode("merchant1234"));
                    m.setRole(Role.ROLE_MERCHANT);
                    return userRepository.save(m);
                });

                List<Category> shopCats = categoryRepository.findByType(CategoryType.SHOP);
                Category foodCat = shopCats.stream().filter(c -> c.getName().get("en").equals("Food")).findFirst().orElse(shopCats.get(0));
                Category hostCat = shopCats.stream().filter(c -> c.getName().get("en").equals("Hospitality")).findFirst().orElse(shopCats.get(0));
                Category servCat = shopCats.stream().filter(c -> c.getName().get("en").equals("Services")).findFirst().orElse(shopCats.get(0));

                createShop(shopRepository, merchant1, foodCat, "Cal Fruiter", 
                    "Productes de proximitat i km0.", "Carrer Major, 12", "977123456", 
                    geometryFactory.createPoint(new Coordinate(1.1040, 41.1570)));

                createShop(shopRepository, merchant2, hostCat, "Restaurant El Racó", 
                    "Cuina tradicional catalana.", "Plaça de la Vila, 5", "977654321", 
                    geometryFactory.createPoint(new Coordinate(1.1050, 41.1555)));

                createShop(shopRepository, merchant3, servCat, "Farmàcia de Baix", 
                    "Atenció farmacèutica i parafarmàcia.", "Carrer de Baix, 3", "977889900", 
                    geometryFactory.createPoint(new Coordinate(1.1030, 41.1550)));
                log.info("Shops and merchants seeded.");
            }

            // 5. Points of Interest
            if (poiRepository.count() == 0) {
                log.info("Seeding points of interest...");
                List<Category> poiCats = categoryRepository.findByType(CategoryType.POI);
                Category monCat = poiCats.stream().filter(c -> c.getName().get("en").equals("Monuments")).findFirst().orElse(poiCats.get(0));
                Category natCat = poiCats.stream().filter(c -> c.getName().get("en").equals("Nature")).findFirst().orElse(poiCats.get(0));

                createPOI(poiRepository, monCat, "Església de Sant Pere", 
                    "Edifici gòtic del segle XVI.", 
                    geometryFactory.createPoint(new Coordinate(1.1060, 41.1565)));

                createPOI(poiRepository, natCat, "Parc del Riu", 
                    "Espai natural per passejar i fer esport.", 
                    geometryFactory.createPoint(new Coordinate(1.1025, 41.1540)));
                log.info("Points of interest seeded.");
            }

            // 6. Announcements
            if (announcementRepository.count() == 0) {
                log.info("Seeding announcements...");
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
                log.info("Announcements seeded.");
            }

            // 7. Events (Agenda & Festes)
            if (eventRepository.count() == 0) {
                log.info("Seeding events (agenda and festivals)...");
                List<Category> eventCats = categoryRepository.findByType(CategoryType.EVENT);
                Category cultureCat = eventCats.stream().filter(c -> c.getName().get("en").equals("Culture")).findFirst().orElse(null);

                if (cultureCat != null) {
                    // Agenda events (not festival)
                    createEvent(eventRepository, cultureCat, false,
                        Map.of("ca", "Concert de Música Clàssica", "es", "Concierto de Música Clásica", "en", "Classical Music Concert"),
                        Map.of("ca", "Gaudeix d'un vespre de música clàssica a càrrec de l'Orquestra Municipal. Intèrprets: Quartet de Corda de Barcelona. Obres de Mozart i Beethoven.", "es", "Disfruta de una velada de música clásica a cargo de la Orquesta Municipal. Intérpretes: Cuarteto de Cuerda de Barcelona. Obras de Mozart y Beethoven.", "en", "Enjoy an evening of classical music by the Municipal Orchestra. Performers: Barcelona String Quartet. Works by Mozart and Beethoven."),
                        Map.of("ca", "Teatre Municipal", "es", "Teatro Municipal", "en", "Municipal Theatre"),
                        OffsetDateTime.now().plusDays(3),
                        OffsetDateTime.now().plusDays(3).plusHours(2),
                        "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800",
                        geometryFactory.createPoint(new Coordinate(1.1045, 41.1568)));

                    createEvent(eventRepository, cultureCat, false,
                        Map.of("ca", "Taller de Ceràmica", "es", "Taller de Cerámica", "en", "Pottery Workshop"),
                        Map.of("ca", "Taller pràctic de ceràmica artesanal per a totes les edats. Aprèn les tècniques bàsiques del torn i la decoració. Material inclòs.", "es", "Taller práctico de cerámica artesanal para todas las edades. Aprende las técnicas básicas del torno y la decoración. Material incluido.", "en", "Hands-on pottery workshop for all ages. Learn basic wheel and decoration techniques. Materials included."),
                        Map.of("ca", "Centre Cultural", "es", "Centro Cultural", "en", "Cultural Center"),
                        OffsetDateTime.now().plusDays(5),
                        OffsetDateTime.now().plusDays(5).plusHours(3),
                        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800",
                        geometryFactory.createPoint(new Coordinate(1.1055, 41.1558)));

                    createEvent(eventRepository, cultureCat, false,
                        Map.of("ca", "Exposició de Pintura: 'Colors del Paisatge'", "es", "Exposición de Pintura: 'Colores del Paisaje'", "en", "Painting Exhibition: 'Colors of the Landscape'"),
                        Map.of("ca", "Exposició col·lectiva d'artistes locals amb obres inspirades en el paisatge rural de la comarca. Inclou pintura a l'oli, aquarel·la i acrílic.", "es", "Exposición colectiva de artistas locales con obras inspiradas en el paisaje rural de la comarca. Incluye pintura al óleo, acuarela y acrílico.", "en", "Group exhibition of local artists with works inspired by the rural landscape. Includes oil, watercolor and acrylic paintings."),
                        Map.of("ca", "Sala d'Exposicions Municipal", "es", "Sala de Exposiciones Municipal", "en", "Municipal Exhibition Hall"),
                        OffsetDateTime.now().plusDays(10),
                        OffsetDateTime.now().plusDays(17),
                        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800",
                        geometryFactory.createPoint(new Coordinate(1.1038, 41.1562)));

                    // Festival events (Festa Major)
                    createEvent(eventRepository, cultureCat, true,
                        Map.of("ca", "Festa Major: Cercavila i Gegants", "es", "Fiesta Mayor: Cercavila y Gigantes", "en", "Town Festival: Parade and Giants"),
                        Map.of("ca", "Inici de la Festa Major amb la tradicional cercavila de gegants, capgrossos i la xaranga. Recorregut: Plaça de la Vila, Carrer Major, Plaça de l'Església.", "es", "Inicio de la Fiesta Mayor con la tradicional cercavila de gigantes, cabezudos y la charanga. Recorrido: Plaza de la Villa, Calle Mayor, Plaza de la Iglesia.", "en", "Start of the Town Festival with the traditional parade of giants, big-heads and the brass band. Route: Town Square, Main Street, Church Square."),
                        Map.of("ca", "Plaça de la Vila", "es", "Plaza de la Villa", "en", "Town Square"),
                        OffsetDateTime.now().plusDays(15),
                        OffsetDateTime.now().plusDays(15).plusHours(3),
                        "https://images.unsplash.com/photo-1560523159-4a9692d222ef?q=80&w=800",
                        geometryFactory.createPoint(new Coordinate(1.1050, 41.1570)));

                    createEvent(eventRepository, cultureCat, true,
                        Map.of("ca", "Festa Major: Concert de Nit", "es", "Fiesta Mayor: Concierto Nocturno", "en", "Town Festival: Night Concert"),
                        Map.of("ca", "Gran concert nocturn amb grups de versions i música actual. Actuaran: 'Versions Band' i 'Sons del Camp'. Barra amb begudes i entrepans.", "es", "Gran concierto nocturno con grupos de versiones y música actual. Actuarán: 'Versions Band' y 'Sons del Camp'. Barra con bebidas y bocadillos.", "en", "Great night concert with cover bands and current music. Featuring: 'Versions Band' and 'Sons del Camp'. Bar with drinks and sandwiches."),
                        Map.of("ca", "Pavelló Municipal d'Esports", "es", "Pabellón Municipal de Deportes", "en", "Municipal Sports Hall"),
                        OffsetDateTime.now().plusDays(15).plusHours(8),
                        OffsetDateTime.now().plusDays(15).plusHours(11),
                        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800",
                        geometryFactory.createPoint(new Coordinate(1.1065, 41.1575)));

                    createEvent(eventRepository, cultureCat, true,
                        Map.of("ca", "Festa Major: Castell de Focs Artificials", "es", "Fiesta Mayor: Castillo de Fuegos Artificiales", "en", "Town Festival: Fireworks Display"),
                        Map.of("ca", "Espectacular castell de focs artificials per tancar la Festa Major. Es recomana portar cadira o manta per seure a la zona del parc.", "es", "Espectacular castillo de fuegos artificiales para cerrar la Fiesta Mayor. Se recomienda traer silla o manta para sentarse en la zona del parque.", "en", "Spectacular fireworks display to close the Town Festival. Bring a chair or blanket to sit in the park area."),
                        Map.of("ca", "Parc del Riu", "es", "Parque del Río", "en", "Riverside Park"),
                        OffsetDateTime.now().plusDays(16),
                        OffsetDateTime.now().plusDays(16).plusHours(1),
                        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800",
                        geometryFactory.createPoint(new Coordinate(1.1020, 41.1540)));
                }
                log.info("Events seeded.");
            }

            // 8. Useful Contacts
            if (contactRepository.count() == 0) {
                log.info("Seeding useful contacts...");
                List<Category> contactCats = categoryRepository.findByType(CategoryType.CONTACT);
                Category emergencyCat = contactCats.stream().filter(c -> c.getName().get("en").equals("Emergencies")).findFirst().orElse(contactCats.get(0));
                Category adminCat = contactCats.stream().filter(c -> c.getName().get("en").equals("Administration")).findFirst().orElse(contactCats.get(0));
                Category healthCat = contactCats.stream().filter(c -> c.getName().get("en").equals("Health")).findFirst().orElse(contactCats.get(0));

                createContact(contactRepository, emergencyCat, 
                    Map.of("ca", "Policia Local", "es", "Policía Local", "en", "Local Police"), 
                    "111 111 11", "shield-outline");

                createContact(contactRepository, adminCat, 
                    Map.of("ca", "Ajuntament", "es", "Ayuntamiento", "en", "Town Hall"), 
                    "111 111 12", "business-outline");

                createContact(contactRepository, healthCat, 
                    Map.of("ca", "Centre d'Atenció Primària (CAP)", "es", "Centro de Atención Primaria (CAP)", "en", "Medical Center"), 
                    "111 111 13", "medical-outline");

                createContact(contactRepository, healthCat, 
                    Map.of("ca", "Farmàcia de Guàrdia", "es", "Farmacia de Guardia", "en", "Pharmacy on Duty"), 
                    "111 111 14", "medkit-outline");
                log.info("Useful contacts seeded.");
            }

            log.info("Database seeding process completed successfully.");
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

    private void createEvent(EventRepository repo, Category cat, boolean festival, Map<String, String> title, Map<String, String> description, Map<String, String> locationText, OffsetDateTime startsAt, OffsetDateTime endsAt, String imageUrl, Point locationGeom) {
        Event event = new Event();
        event.setTitle(title);
        event.setDescription(description);
        event.setLocationText(locationText);
        event.setCategory(cat);
        event.setFestival(festival);
        event.setStartsAt(startsAt);
        event.setEndsAt(endsAt);
        event.setImageUrl(imageUrl);
        event.setLocationGeom(locationGeom);
        repo.save(event);
    }

    private void createContact(ContactRepository repo, Category cat, Map<String, String> names, String phone, String icon) {
        Contact contact = new Contact();
        contact.setServiceName(names);
        contact.setPhoneNumber(phone);
        contact.setIconName(icon);
        contact.setCategory(cat);
        repo.save(contact);
    }
}

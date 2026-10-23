package com.coorgtourism.config;

import com.coorgtourism.entity.Homestay;
import com.coorgtourism.entity.Role;
import com.coorgtourism.entity.TouristPlace;
import com.coorgtourism.entity.User;
import com.coorgtourism.repository.HomestayRepository;
import com.coorgtourism.repository.TouristPlaceRepository;
import com.coorgtourism.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;

@Component
public class AdminBootstrap implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminBootstrap.class);
    
    private final UserRepository userRepository;
    private final HomestayRepository homestayRepository;
    private final TouristPlaceRepository touristPlaceRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${admin.setup.enabled:false}")
    private boolean setupEnabled;
    
    @Value("${admin.setup.email:admin@coorgtourism.com}")
    private String adminEmail;
    
    @Value("${admin.setup.password:Password123!}")
    private String adminPassword;

    public AdminBootstrap(UserRepository userRepository,
                          HomestayRepository homestayRepository,
                          TouristPlaceRepository touristPlaceRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.homestayRepository = homestayRepository;
        this.touristPlaceRepository = touristPlaceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!setupEnabled) {
            logger.debug("Admin bootstrapping is disabled.");
            return;
        }

        // 1. Initial Admin
        if (userRepository.countByRole(Role.ADMIN) == 0 && userRepository.findByEmail(adminEmail).isEmpty()) {
            logger.info("Bootstrapping initial admin account with email: {}", adminEmail);
            User admin = User.builder()
                    .name("System Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .phone("9876543210")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }

        // 2. Demo Owner
        User owner = userRepository.findByEmail("kariappa.stays@gmail.com").orElseGet(() -> {
            logger.info("Bootstrapping demo owner account");
            return userRepository.save(User.builder()
                    .name("Kariappa Bopanna")
                    .email("kariappa.stays@gmail.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .phone("9845019284")
                    .role(Role.OWNER)
                    .build());
        });

        // 3. Demo Traveler
        if (userRepository.findByEmail("rahul.traveler@gmail.com").isEmpty()) {
            logger.info("Bootstrapping demo traveler account");
            userRepository.save(User.builder()
                    .name("Rahul Sharma")
                    .email("rahul.traveler@gmail.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .phone("9876543211")
                    .role(Role.CUSTOMER)
                    .build());
        }

        // 4. Starter Homestays
        if (homestayRepository.count() == 0) {
            logger.info("Bootstrapping starter Coorg homestays");
            homestayRepository.saveAll(List.of(
                    Homestay.builder()
                            .name("Misty Woods Coffee Estate Stay")
                            .owner(owner)
                            .location("Madikeri, Coorg")
                            .pricePerNight(new BigDecimal("1950.00"))
                            .rating(new BigDecimal("4.90"))
                            .imageUrl("https://images.unsplash.com/photo-1596568359546-24baeb9e2b1e?auto=format&fit=crop&q=80&w=600")
                            .description("Surrounded by 15 acres of Arabica coffee and pepper vines, wake up to misty hill vistas.")
                            .build(),
                    Homestay.builder()
                            .name("Silver Brook Heritage Homestay")
                            .owner(owner)
                            .location("Siddapur Road, Madikeri")
                            .pricePerNight(new BigDecimal("2400.00"))
                            .rating(new BigDecimal("4.80"))
                            .imageUrl("https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=600")
                            .description("Traditional tiled Kodava bungalow nestled right by a freshwater brook with homemade delights.")
                            .build(),
                    Homestay.builder()
                            .name("Cloud Valley Eco Retreat")
                            .owner(owner)
                            .location("Mandalpatti Foothills, Somwarpet")
                            .pricePerNight(new BigDecimal("2850.00"))
                            .rating(new BigDecimal("4.95"))
                            .imageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600")
                            .description("Panoramic cliff views overlooking the Western Ghats with direct jeep safari connectivity.")
                            .build(),
                    Homestay.builder()
                            .name("Golden Oak Family Homestay")
                            .owner(owner)
                            .location("Kushalnagar, Coorg")
                            .pricePerNight(new BigDecimal("1450.00"))
                            .rating(new BigDecimal("4.70"))
                            .imageUrl("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600")
                            .description("Cozy family stay centrally located near Dubare Elephant Camp and the Tibetan Monastery.")
                            .build()
            ));
        }

        // 5. Starter Tourist Places
        if (touristPlaceRepository.count() == 0) {
            logger.info("Bootstrapping starter Coorg tourist attractions");
            touristPlaceRepository.saveAll(List.of(
                    TouristPlace.builder()
                            .name("Raja's Seat Sunset Viewpoint")
                            .category("VIEWPOINT")
                            .location("Madikeri Town")
                            .entryFee(new BigDecimal("25.00"))
                            .rating(new BigDecimal("4.80"))
                            .openingTime("06:00 AM")
                            .closingTime("08:00 PM")
                            .imageUrl("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600")
                            .description("Seasonal garden of flowers offering panoramic sunset views of the Western Ghats valleys.")
                            .build(),
                    TouristPlace.builder()
                            .name("Abbey Falls (Abbi)")
                            .category("WATERFALL")
                            .location("Madikeri (8 km away)")
                            .entryFee(new BigDecimal("15.00"))
                            .rating(new BigDecimal("4.90"))
                            .openingTime("09:00 AM")
                            .closingTime("05:00 PM")
                            .imageUrl("https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=600")
                            .description("Breathtaking waterfall cascading 70 feet down rocks nestled inside private spice estates.")
                            .build(),
                    TouristPlace.builder()
                            .name("Dubare Elephant Camp & River Rafting")
                            .category("WILDLIFE")
                            .location("Kushalnagar / Cauvery Banks")
                            .entryFee(new BigDecimal("100.00"))
                            .rating(new BigDecimal("4.85"))
                            .openingTime("09:00 AM")
                            .closingTime("11:30 AM")
                            .imageUrl("https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=600")
                            .description("Interact closely with trained elephants and enjoy rafting along the Cauvery River.")
                            .build(),
                    TouristPlace.builder()
                            .name("Namdroling Monastery (Golden Temple)")
                            .category("HERITAGE")
                            .location("Bylakuppe, Kushalnagar")
                            .entryFee(BigDecimal.ZERO)
                            .rating(new BigDecimal("4.95"))
                            .openingTime("07:00 AM")
                            .closingTime("06:00 PM")
                            .imageUrl("https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=600")
                            .description("Largest teaching center of Nyingma Tibetan Buddhism with 40-foot gilded golden statues.")
                            .build()
            ));
        }

        logger.info("Application bootstrap checks completed.");
    }
}

package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            System.out.println("Seeding initial users...");

            // Admin
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setStatus("Active");
            admin.setSubscription("Free");
            userRepository.save(admin);

            // Regular User
            User user1 = new User();
            user1.setName("John Doe");
            user1.setEmail("john@example.com");
            user1.setPassword(passwordEncoder.encode("user123"));
            user1.setRole("USER");
            user1.setStatus("Active");
            user1.setSubscription("Premium");
            userRepository.save(user1);

            // Enterprise User
            User user2 = new User();
            user2.setName("Alice Corp");
            user2.setEmail("alice@corp.com");
            user2.setPassword(passwordEncoder.encode("password"));
            user2.setRole("USER");
            user2.setStatus("Active");
            user2.setSubscription("Enterprise");
            userRepository.save(user2);

            System.out.println("Users seeded!");
        }
    }
}

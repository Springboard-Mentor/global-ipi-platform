package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Check if admin exists
            String adminEmail = "admin@globalipi.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setName("System Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("Admin@123")); // Default password
                admin.setRole("ADMIN");
                admin.setStatus("Active");
                admin.setSubscription("Enterprise");
                admin.setCreatedAt(Instant.now());
                
                userRepository.save(admin);
                System.out.println("----------------------------------------------------------");
                System.out.println("ADMIN ACCOUNT RESTORED");
                System.out.println("Email: " + adminEmail);
                System.out.println("Password: Admin@123");
                System.out.println("----------------------------------------------------------");
            }
        };
    }
}

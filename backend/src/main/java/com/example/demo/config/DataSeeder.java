package com.example.demo.config;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.subscription.entity.SubscriptionHistory;
import com.example.demo.subscription.entity.SubscriptionPlan;
import com.example.demo.subscription.repository.SubscriptionHistoryRepository;
import com.example.demo.subscription.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SubscriptionPlanRepository planRepository;
    private final SubscriptionHistoryRepository historyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        migrateLegacyPlans(); // Added migration logic
        seedPlans();
        seedUsers();
        seedHistory();
    }

    private void migrateLegacyPlans() {
        System.out.println("Checking for legacy subscription plans (Basic/Premium)...");
        
        // 1. Rename existing plan entities safely
        planRepository.findByName("Basic").ifPresent(plan -> {
            if (planRepository.findByName("Pro").isPresent()) {
                planRepository.delete(plan);
            } else {
                System.out.println("Migrating plan: Basic -> Pro");
                plan.setName("Pro");
                planRepository.save(plan);
            }
        });

        planRepository.findByName("Premium").ifPresent(plan -> {
            if (planRepository.findByName("Enterprise").isPresent()) {
                planRepository.delete(plan);
            } else {
                System.out.println("Migrating plan: Premium -> Enterprise");
                plan.setName("Enterprise");
                plan.setPrice(99.0);
                planRepository.save(plan);
            }
        });

        // 2. Update existing users who have "Basic" or "Premium" strings
        userRepository.findAll().forEach(user -> {
            boolean updated = false;
            if ("Basic".equalsIgnoreCase(user.getSubscription())) {
                user.setSubscription("Pro");
                updated = true;
            } else if ("Premium".equalsIgnoreCase(user.getSubscription())) {
                user.setSubscription("Enterprise");
                updated = true;
            }
            if (updated) {
                System.out.println("Migrated user " + user.getEmail() + " to new subscription name.");
                userRepository.save(user);
            }
        });

        // 3. Update history records
        historyRepository.findAll().forEach(h -> {
            boolean updated = false;
            if ("Basic".equalsIgnoreCase(h.getOldPlan())) { h.setOldPlan("Pro"); updated = true; }
            if ("Basic".equalsIgnoreCase(h.getNewPlan())) { h.setNewPlan("Pro"); updated = true; }
            if ("Premium".equalsIgnoreCase(h.getOldPlan())) { h.setOldPlan("Enterprise"); updated = true; }
            if ("Premium".equalsIgnoreCase(h.getNewPlan())) { h.setNewPlan("Enterprise"); updated = true; }
            if (updated) {
                historyRepository.save(h);
            }
        });
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
            user1.setSubscription("Pro");
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

        }
    }

    private void seedPlans() {
        if (planRepository.count() == 0) {
            System.out.println("Seeding subscription plans...");
            
            planRepository.save(SubscriptionPlan.builder()
                    .name("Free")
                    .price(0.0)
                    .period("monthly")
                    .features(Arrays.asList("Basic IP Search", "Limited Queries (10/month)", "Community Support"))
                    .popular(false)
                    .active(true)
                    .build());

            planRepository.save(SubscriptionPlan.builder()
                    .name("Pro")
                    .price(29.0)
                    .period("monthly")
                    .features(Arrays.asList("Advanced IP Search", "100 Queries/month", "Email Support", "Patent Tracking"))
                    .popular(true)
                    .active(true)
                    .build());

            planRepository.save(SubscriptionPlan.builder()
                    .name("Enterprise")
                    .price(99.0)
                    .period("monthly")
                    .features(Arrays.asList("Unlimited Everything", "Dedicated Support", "API Access", "Custom Integration", "SLA Guaranteed"))
                    .popular(false)
                    .active(true)
                    .build());
            
            System.out.println("Plans seeded!");
        }
    }

    private void seedHistory() {
        if (historyRepository.count() == 0) {
            System.out.println("Seeding subscription history...");
            
            historyRepository.save(SubscriptionHistory.builder()
                    .userId(1L)
                    .userName("Admin User")
                    .oldPlan("None")
                    .newPlan("Free")
                    .amount(0.0)
                    .action("NEW")
                    .build());

            historyRepository.save(SubscriptionHistory.builder()
                    .userId(2L)
                    .userName("John Doe")
                    .oldPlan("Free")
                    .newPlan("Pro")
                    .amount(29.0)
                    .action("UPGRADED")
                    .build());

            System.out.println("History seeded!");
        }
    }
}

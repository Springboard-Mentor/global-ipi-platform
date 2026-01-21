package com.example.demo.service.impl;

import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;

import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import com.example.demo.filing.repository.PatentFilingRepository;
import com.example.demo.filing.entity.PatentFiling;
import com.example.demo.subscription.repository.SubscriptionHistoryRepository;
import com.example.demo.notification.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final com.example.demo.notification.service.NotificationService notificationService;
    private final com.example.demo.subscription.repository.SubscriptionPlanRepository planRepository;
    private final SubscriptionHistoryRepository historyRepository;
    private final PatentFilingRepository filingRepository;
    private final NotificationRepository notificationRepository;

    // -----------------------------
    // REGISTER
    // -----------------------------
    @Override
    public String register(RegisterRequest request) {

        if (repo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setCreatedAt(Instant.now());

        repo.save(user);
        return "User registered successfully!";
    }

    // -----------------------------
    // CRUD OPERATIONS
    // -----------------------------
    @Override
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return repo.findById(id);
    }

    @Override
    public User createUser(User user) {
        if (repo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(Instant.now());
        return repo.save(user);
    }

    // -----------------------------
    // ADMIN ACTIONS
    // -----------------------------
    @Override
    public User updateUser(Long id, User details) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (details.getName() != null) user.setName(details.getName());
        if (details.getEmail() != null) user.setEmail(details.getEmail());
        if (details.getPhone() != null) user.setPhone(details.getPhone());
        if (details.getCountryCode() != null) user.setCountryCode(details.getCountryCode());
        if (details.getRole() != null) user.setRole(details.getRole());
        if (details.getSubscription() != null) user.setSubscription(details.getSubscription());

        // Handle Status Change
        if (details.getStatus() != null && !details.getStatus().equals(user.getStatus())) {
            
            // If admin is disabling the account
            if ("Inactive".equalsIgnoreCase(details.getStatus()) || "Disabled".equalsIgnoreCase(details.getStatus())) {
                user.setStatus("Disabled");
                user.setDisabledAt(Instant.now());

                // Send Alert Notification
                com.example.demo.notification.dto.NotificationRequest notif = new com.example.demo.notification.dto.NotificationRequest();
                notif.setUserId(user.getId());
                notif.setMessage("Your account has been disabled. It will be permanently deleted in 30 days if no action is taken.");
                notif.setType("ALERT");
                notificationService.create(notif);

            } else {
                // Re-enabling
                user.setStatus(details.getStatus());
                user.setDisabledAt(null); // Clear disable timer
            }
        }

        return repo.save(user);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteUser(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        /* 
           Cascade Deletion:
           1. Notifications
           2. Subscription History
           3. Patent Filings
           4. User Account
        */
        
        // 1. Delete Notifications
        notificationRepository.deleteByUserId(id);

        // 2. Delete Subscription History
        historyRepository.deleteByUserId(id);

        // 3. Delete Patent Filings
        // Note: Patent Filings might have drawings/inventors which should cascade via JPA if set up, 
        // but explicit delete is safer for clean sweep without relying on complex entity graphs.
        // 3. Delete Patent Filings
        // Fetch and delete all to ensure JPA Cascades handle associated collections (Drawings, update fields, Inventor join table)
        List<PatentFiling> filings = filingRepository.findByUserId(id);
        filingRepository.deleteAll(filings);

        // 4. Delete the User
        repo.delete(user);
    }

    // -----------------------------
    // PROFILE OPERATIONS
    // -----------------------------
    @Override
    public User findByEmail(String email) {
        return repo.findByEmail(email).orElse(null);
    }

    @Override
    public User updateProfile(String email, UpdateProfileRequest request) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null)
            user.setName(request.getName());

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (repo.existsByEmail(request.getEmail()))
                throw new RuntimeException("Email already in use");
            user.setEmail(request.getEmail());
        }

        if (request.getPhone() != null)
            user.setPhone(request.getPhone());

        if (request.getCountryCode() != null)
            user.setCountryCode(request.getCountryCode());

        return repo.save(user);
    }

    // -----------------------------
    // CHANGE PASSWORD
    // -----------------------------
    @Override
    public void changePassword(String email, ChangePasswordRequest request) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        repo.save(user);
    }

    @Override
    public void upgradeSubscription(String email, String planName) {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String oldPlan = user.getSubscription() != null ? user.getSubscription() : "Free";
        
        // Find plan details to get price
        double amount = planRepository.findByName(planName)
                .map(p -> p.getPrice())
                .orElse(0.0);

        user.setSubscription(planName);
        repo.save(user);

        // Record history
        com.example.demo.subscription.entity.SubscriptionHistory history = com.example.demo.subscription.entity.SubscriptionHistory.builder()
                .userId(user.getId())
                .userName(user.getName())
                .oldPlan(oldPlan)
                .newPlan(planName)
                .amount(amount)
                .action("UPGRADED")
                .build();
        
        historyRepository.save(history);

        // Send confirmation notification
        com.example.demo.notification.dto.NotificationRequest notif = new com.example.demo.notification.dto.NotificationRequest();
        notif.setUserId(user.getId());
        notif.setMessage("Success! You've upgraded to the " + planName + " plan.");
        notif.setType("SUBSCRIPTION");
        notificationService.create(notif);
    }
}

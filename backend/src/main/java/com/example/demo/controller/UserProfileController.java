package com.example.demo.controller;

import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.UserResponse;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {

    private final UserService userService;

    // =======================================
    //  GET LOGGED-IN USER DETAILS
    // =======================================
    @GetMapping("/me")
    public ResponseEntity<?> getLoggedInUser(Authentication auth) {

        String email = auth.getName();
        User user = userService.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        UserResponse response = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getCountryCode(),
                user.getStatus(),
                user.getSubscription(),
                user.getDisabledAt()
        );

        return ResponseEntity.ok(response);
    }

    // =======================================
    //  UPDATE PROFILE
    // =======================================
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication auth
    ) {
        try {
            String email = auth.getName();
            User updatedUser = userService.updateProfile(email, request);

            UserResponse response = new UserResponse(
                    updatedUser.getId(),
                    updatedUser.getName(),
                    updatedUser.getEmail(),
                    updatedUser.getPhone(),
                    updatedUser.getCountryCode(),
                    updatedUser.getStatus(),
                    updatedUser.getSubscription(),
                    updatedUser.getDisabledAt()
            );

            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(
                    "Profile update failed: " + ex.getMessage()
            );
        }
    }

    // =======================================
    //  CHANGE PASSWORD
    // =======================================
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication auth
    ) {
        try {
            String email = auth.getName();
            userService.changePassword(email, request);

            return ResponseEntity.ok("Password updated successfully");

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(
                    "Password update failed: " + ex.getMessage()
            );
        }
    }

    @PutMapping("/upgrade-subscription")
    public ResponseEntity<?> upgradeSubscription(
            @RequestParam String planName,
            Authentication auth
    ) {
        try {
            String email = auth.getName();
            userService.upgradeSubscription(email, planName);
            return ResponseEntity.ok("Subscription upgraded to " + planName);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Upgrade failed: " + ex.getMessage());
        }
    }
}

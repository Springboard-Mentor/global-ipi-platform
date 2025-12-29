package com.example.backend.controller;

import com.example.backend.dto.AdminLoginRequest;
import com.example.backend.dto.AdminResponse;
import com.example.backend.model.AdminUser;
import com.example.backend.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminUserRepository adminUserRepository;

    /**
     * Admin login endpoint with complete validation
     * Validates: adminId, adminName, email, and password
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest loginRequest) {
        try {
            // Validate all fields are present
            if (loginRequest.getAdminId() == null || 
                loginRequest.getAdminName() == null || 
                loginRequest.getEmail() == null || 
                loginRequest.getPassword() == null) {
                return ResponseEntity.badRequest().body("All fields are required");
            }

            // Find admin by all credentials
            Optional<AdminUser> adminOptional = adminUserRepository
                .findByAdminIdAndAdminNameAndEmailAndPassword(
                    loginRequest.getAdminId(),
                    loginRequest.getAdminName(),
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                );

            if (adminOptional.isPresent()) {
                AdminUser admin = adminOptional.get();
                
                // Return admin data without password
                AdminResponse response = new AdminResponse(
                    admin.getAdminId(),
                    admin.getAdminName(),
                    admin.getEmail(),
                    admin.getCreatedAt()
                );
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials. Please check all fields.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Login failed: " + e.getMessage());
        }
    }

    /**
     * Get all admin users (without passwords)
     */
    @GetMapping("/all")
    public ResponseEntity<List<AdminResponse>> getAllAdmins() {
        try {
            List<AdminUser> admins = adminUserRepository.findAll();
            
            List<AdminResponse> responses = admins.stream()
                .map(admin -> new AdminResponse(
                    admin.getAdminId(),
                    admin.getAdminName(),
                    admin.getEmail(),
                    admin.getCreatedAt()
                ))
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get admin by ID (without password)
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        try {
            Optional<AdminUser> adminOptional = adminUserRepository.findById(id);
            
            if (adminOptional.isPresent()) {
                AdminUser admin = adminOptional.get();
                AdminResponse response = new AdminResponse(
                    admin.getAdminId(),
                    admin.getAdminName(),
                    admin.getEmail(),
                    admin.getCreatedAt()
                );
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error fetching admin: " + e.getMessage());
        }
    }
}

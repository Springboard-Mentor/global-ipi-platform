package com.example.backend.dto;

import java.time.LocalDateTime;

public class AdminResponse {
    
    private Long adminId;
    private String adminName;
    private String email;
    private LocalDateTime createdAt;

    // Constructors
    public AdminResponse() {
    }

    public AdminResponse(Long adminId, String adminName, String email, LocalDateTime createdAt) {
        this.adminId = adminId;
        this.adminName = adminName;
        this.email = email;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getAdminId() {
        return adminId;
    }

    public void setAdminId(Long adminId) {
        this.adminId = adminId;
    }

    public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

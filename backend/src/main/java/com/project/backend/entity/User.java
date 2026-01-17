package com.project.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String userType;

    @Column(name = "created_at")
    private LocalDateTime createdAt; 

    // --- FORGOT PASSWORD FIELDS ---
    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    // --- SUBSCRIPTION FIELDS ---
    @Column(name = "plan_type")
    private String planType = "STARTUP"; 

    @Column(name = "subscription_date")
    private LocalDateTime subscriptionDate;

    @Column(name = "renewal_date")
    private String renewalDate;

    @Column(name = "amount_paid")
    private Double amountPaid = 0.0;

    @Column(name = "billing_cycle")
    private String billingCycle;

    // --- 🟢 PROFILE FIELDS (Essential for Profile Page) ---
    private String avatar; // Fixes "setAvatar undefined" error
    
    @Column(length = 500)
    private String bio;
    private String phone;
    private String company;
    private String location;
    private String jobTitle;
    private String linkedin;
    private String website;

    // Constructors
    public User() {}

    public User(String name, String email, String password, String userType) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.userType = userType;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.planType == null) this.planType = "STARTUP";
    }

    // --- GETTERS & SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }

    public LocalDateTime getResetTokenExpiry() { return resetTokenExpiry; }
    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) { this.resetTokenExpiry = resetTokenExpiry; }

    // Subscription Getters/Setters
    public String getPlanType() { return planType; }
    public void setPlanType(String planType) { this.planType = planType; }

    public LocalDateTime getSubscriptionDate() { return subscriptionDate; }
    public void setSubscriptionDate(LocalDateTime subscriptionDate) { this.subscriptionDate = subscriptionDate; }

    public String getRenewalDate() { return renewalDate; }
    public void setRenewalDate(String renewalDate) { this.renewalDate = renewalDate; }

    public Double getAmountPaid() { return amountPaid; }
    public void setAmountPaid(Double amountPaid) { this.amountPaid = amountPaid; }

    public String getBillingCycle() { return billingCycle; }
    public void setBillingCycle(String billingCycle) { this.billingCycle = billingCycle; }

    // 🟢 PROFILE GETTERS/SETTERS (Required for Service)
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}
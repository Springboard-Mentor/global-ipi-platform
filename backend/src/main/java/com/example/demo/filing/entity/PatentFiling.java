package com.example.demo.filing.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patent_filings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatentFiling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User relationship
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Applicant Details
    @Column(nullable = false)
    private String applicantName;

    @Column(nullable = false)
    private String applicantType; // Individual, Startup, Company, University

    @Column(nullable = false)
    private String nationality;

    @Column(nullable = false)
    private String addressStreet;

    @Column(nullable = false)
    private String addressCity;

    @Column(nullable = false)
    private String addressState;

    @Column(nullable = false)
    private String addressPostalCode;

    @Column(nullable = false)
    private Boolean correspondenceSame;

    private String correspondenceStreet;
    private String correspondenceCity;
    private String correspondenceState;
    private String correspondencePostalCode;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String filingRole; // Inventor, Assignee, Agent

    @Column(nullable = false)
    private Boolean isInventor;

    @Column(nullable = false)
    private String idType; // Aadhaar, Passport, Company Registration

    @Column(nullable = false)
    private String idNumber;

    // Patent Details
    @Column(nullable = false)
    private String patentType; // Utility, Design, Provisional, Plant

    @Column(nullable = false)
    private String jurisdiction; // India, US, WIPO

    @Column(nullable = false)
    private String technicalField; // AI, Mechanical, Electronics, etc.

    @Column(nullable = false, length = 1000)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String abstractText;

    @Column(columnDefinition = "TEXT")
    private String problemStatement;

    @Column(columnDefinition = "TEXT")
    private String novelty;

    @Column(nullable = false)
    private Boolean priorityClaim;

    private String priorityApplicationNumber;
    private LocalDate priorityDate;

    // File paths (stored as strings - files would be uploaded separately)
    private String specificationFilePath;
    private String claimsFilePath;

    @ElementCollection
    @CollectionTable(name = "patent_filing_drawings", joinColumns = @JoinColumn(name = "filing_id"))
    @Column(name = "file_path")
    private List<String> drawingsFilePaths = new ArrayList<>();

    // Inventors (Many-to-Many)
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "patent_filing_inventors",
        joinColumns = @JoinColumn(name = "filing_id"),
        inverseJoinColumns = @JoinColumn(name = "inventor_id")
    )
    private List<Inventor> inventors = new ArrayList<>();

    // Payment Details
    private String paymentMethod; // card, upi, netbank
    private String paymentStatus; // unpaid, paid
    private Double totalFee;

    // Filing Metadata
    private String applicationNumber;
    private LocalDate filingDate;
    private LocalDate expiryDate;
    private LocalDate grantDate;
    private String status; // FILED, GRANTED, EXPIRED, EXPIRING SOON

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @Column(columnDefinition = "TEXT")
    private String adminFeedback;

    @ElementCollection
    @CollectionTable(name = "patent_filing_requested_updates", joinColumns = @JoinColumn(name = "filing_id"))
    @Column(name = "field_name")
    private List<String> requestedUpdateFields = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        if (filingDate == null) {
            filingDate = LocalDate.now();
        }
        if (status == null) {
            status = "FILED";
        }
        if (applicationNumber == null) {
            applicationNumber = generateApplicationNumber();
        }
        if (expiryDate == null && filingDate != null) {
            expiryDate = filingDate.plusYears(20); // Default 20 years
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    private String generateApplicationNumber() {
        return "APP-" + System.currentTimeMillis();
    }
}
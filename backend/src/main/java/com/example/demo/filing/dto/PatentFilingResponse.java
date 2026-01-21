package com.example.demo.filing.dto;

import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data
public class PatentFilingResponse {
    
    private Long id;
    private Long userId;
    
    // Applicant Details
    private String applicantName;
    private String applicantType;
    private String nationality;
    private String addressStreet;
    private String addressCity;
    private String addressState;
    private String addressPostalCode;
    private Boolean correspondenceSame;
    private String correspondenceStreet;
    private String correspondenceCity;
    private String correspondenceState;
    private String correspondencePostalCode;
    private String email;
    private String phone;
    private String filingRole;
    private Boolean isInventor;
    private String idType;
    private String idNumber;

    // Patent Details
    private String patentType;
    private String jurisdiction;
    private String technicalField;
    private String title;
    private String abstractText;
    private String problemStatement;
    private String novelty;
    private List<InventorResponse> inventors;
    private Boolean priorityClaim;
    private String priorityApplicationNumber;
    private LocalDate priorityDate;

    // File paths
    private String specificationFilePath;
    private String claimsFilePath;
    private List<String> drawingsFilePaths;

    // Payment Details
    private String paymentMethod;
    private String paymentStatus;
    private Double totalFee;

    // Filing Metadata
    private String applicationNumber;
    private LocalDate filingDate;
    private LocalDate expiryDate;
    private LocalDate grantDate;
    private String status;

    private Instant createdAt;
    private Instant updatedAt;
    private String adminFeedback;
    private List<String> requestedUpdateFields;

    @Data
    public static class InventorResponse {
        private Long id;
        private String name;
    }
}

package com.example.demo.filing.dto;

import lombok.Data;
import java.util.List;

@Data
public class PatentFilingRequest {
    
    // Applicant Details
    @jakarta.validation.constraints.NotBlank(message = "Applicant Name is required")
    private String applicantName;
    
    @jakarta.validation.constraints.NotBlank(message = "Applicant Type is required")
    private String applicantType;
    
    @jakarta.validation.constraints.NotBlank(message = "Nationality is required")
    private String nationality;
    
    @jakarta.validation.constraints.NotBlank(message = "Street Address is required")
    private String addressStreet;
    
    @jakarta.validation.constraints.NotBlank(message = "City is required")
    private String addressCity;
    
    @jakarta.validation.constraints.NotBlank(message = "State is required")
    private String addressState;
    
    @jakarta.validation.constraints.NotBlank(message = "Postal Code is required")
    private String addressPostalCode;
    
    @jakarta.validation.constraints.NotNull(message = "Correspondence Same flag is required")
    private Boolean correspondenceSame;
    
    private String correspondenceStreet;
    private String correspondenceCity;
    private String correspondenceState;
    private String correspondencePostalCode;
    
    @jakarta.validation.constraints.NotBlank(message = "Email is required")
    @jakarta.validation.constraints.Email(message = "Valid Email is required")
    private String email;
    
    @jakarta.validation.constraints.NotBlank(message = "Phone validation is required")
    private String phone;
    
    @jakarta.validation.constraints.NotBlank(message = "Filing Role is required")
    private String filingRole;
    
    @jakarta.validation.constraints.NotNull(message = "Is Inventor flag is required")
    private Boolean isInventor;
    
    @jakarta.validation.constraints.NotBlank(message = "ID Type is required")
    private String idType;
    
    @jakarta.validation.constraints.NotBlank(message = "ID Number is required")
    private String idNumber;

    // Patent Details
    @jakarta.validation.constraints.NotBlank(message = "Patent Type is required")
    private String patentType;
    
    @jakarta.validation.constraints.NotBlank(message = "Jurisdiction is required")
    private String jurisdiction;
    
    @jakarta.validation.constraints.NotBlank(message = "Technical Field is required")
    private String technicalField;
    
    @jakarta.validation.constraints.NotBlank(message = "Title is required")
    private String title;
    
    private String abstractText;
    private String problemStatement;
    private String novelty;
    private List<InventorRequest> inventors;
    private Boolean priorityClaim;
    private String priorityApplicationNumber;
    private String priorityDate; // ISO date string

    // File paths (after upload)
    private String specificationFilePath;
    private String claimsFilePath;
    private List<String> drawingsFilePaths;

    // Payment Details
    private String paymentMethod;
    private String paymentStatus;
    private Double totalFee;

    @Data
    public static class InventorRequest {
        @jakarta.validation.constraints.NotBlank(message = "Inventor Name is required")
        private String name;
    }
}

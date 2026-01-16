package com.example.demo.filing.dto;

import lombok.Data;
import java.util.List;

@Data
public class PatentFilingRequest {
    
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
        private String name;
    }
}

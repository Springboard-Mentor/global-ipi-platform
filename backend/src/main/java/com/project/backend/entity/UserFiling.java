package com.project.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "user_filings")
@Data
public class UserFiling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    // MATCHES FRONTEND: 'applicationNumber'
    @Column(name = "application_number")
    private String applicationNumber;

    // MATCHES FRONTEND: 'patentNumber' (kept for internal tracking/IPAsset links)
    @Column(name = "patent_number")
    private String patentNumber;

    private String title;
    private String category;
    private String filingType;
    private String inventorName;
    
    private String assignee;
    private String jurisdiction;

    // NEW FIELDS FROM FRONTEND
    private String email;
    private LocalDate filingDate;
    private LocalDate expirationDate; 
    private String patentStatus; // e.g., "Pending", "Granted"

    @Column(columnDefinition = "TEXT")
    private String description;

    private String tags;

    // Internal System Status (e.g., "TRACKED", "SUBMITTED")
    private String status = "PENDING"; 

    private LocalDate submissionDate;
}
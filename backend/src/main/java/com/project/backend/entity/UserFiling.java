package com.project.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "user_filings")
@Data
public class UserFiling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ✅ CRITICAL: This generates the ID automatically
    private Long id;

    private String title;
    private String category;
    private String filingType;
    private String inventorName;
    private LocalDate filingDate;
    private LocalDate submissionDate;
    private String assignee;
    private String jurisdiction;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    private String tags;
    
    private String status = "PENDING"; // Default status for new filings
}
package com.example.demo.filingtracker.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "filing_tracker", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "application_number"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilingTracker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "title")
    private String title;

    @Column(name = "abstract_text", columnDefinition = "TEXT")
    private String abstractText;

    @Column(name = "inventors")
    private String inventors;

    @Column(name = "assignee")
    private String assignee;

    @Column(name = "application_number", nullable = false)
    private String applicationNumber;

    @Column(name = "jurisdiction")
    private String jurisdiction;

    @Column(name = "ip_type")
    private String ipType;

    @Column(name = "filing_date")
    private LocalDate filingDate;

    @Column(name = "priority_date")
    private LocalDate priorityDate;

    @Column(name = "publication_date")
    private LocalDate publicationDate;

    @Column(name = "grant_date")
    private LocalDate grantDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "renewal_date")
    private LocalDate renewalDate;

    @Column(name = "current_status")
    private String currentStatus;

    @Column(name = "source")
    private String source;

    @CreationTimestamp
    @Column(name = "tracked_at", updatable = false)
    private LocalDateTime trackedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

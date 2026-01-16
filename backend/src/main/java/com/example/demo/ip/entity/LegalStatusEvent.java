package com.example.demo.ip.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "legal_status_events")
public class LegalStatusEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private IPAsset asset;

    @Column(nullable = false)
    private String status;

    private java.time.LocalDate eventDate;

    private String country;
    private String source;

    private java.time.LocalDate createdOn;

    @PrePersist
    private void onCreate() {
        this.createdOn = java.time.LocalDate.now();
    }

    // ===== getters & setters =====

    public void setAsset(IPAsset asset) {
        this.asset = asset;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setEventDate(java.time.LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getStatus() {
        return status;
    }

    public java.time.LocalDate getEventDate() {
        return eventDate;
    }

    public String getCountry() {
        return country;
    }

    public String getSource() {
        return source;
    }
}

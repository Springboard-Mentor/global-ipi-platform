package com.example.demo.ip.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;        
import jakarta.persistence.Id;     
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Table(name = "filings")
@Data
public class Filing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;

    private String eventType; // Filed, Examination, Grant, Renewal
    private LocalDate eventDate;
    private String remarks;

    @ManyToOne
    @JoinColumn(name = "ip_asset_id")
    private IPAsset ipAsset;
}

package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import com.example.backend.enums.IPType;

@Entity
@Table(name = "ip_assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IPAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Enumerated(EnumType.STRING)
    private IPType type;

    @Column(name = "asset_number")
    private String assetNumber;

    @Column(nullable = false)
    private String title;

    private String assignee;

    private String inventor;

    private String jurisdiction;

    @Column(name = "filing_date")
    private LocalDateTime filingDate;

    private String status;

    @Column(name = "class")
    private String assetClass;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "api_source")
    private String apiSource;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @OneToMany(mappedBy = "ipAsset", cascade = CascadeType.ALL)
    private List<Filing> filings;
}

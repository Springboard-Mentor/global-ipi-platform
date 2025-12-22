package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.example.backend.enums.FilingStatus;

@Entity
@Table(name = "filings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Filing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ip_asset_id", nullable = false)
    private IPAsset ipAsset;

    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    private FilingStatus status;

    @Column(columnDefinition = "TEXT")
    private String description;
}

package com.ipsearch.engine.entity;

import com.ipsearch.engine.entity.enums.FilingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Filing entity representing a legal status timeline entry for an IP asset.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "ipAsset")
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "filings")
public class Filing {

    /**
     * Primary key (auto-generated).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Date of this filing / event in the legal timeline.
     */
    @Column(name = "date", nullable = false)
    private LocalDate date;

    /**
     * Status for this filing step.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private FilingStatus status;

    /**
     * Optional description (e.g., "Exam report issued").
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Many filings belong to one IP asset.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ip_asset_id", nullable = false)
    private IPAsset ipAsset;
}



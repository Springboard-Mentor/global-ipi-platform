package com.ipsearch.engine.entity;

import com.ipsearch.engine.entity.enums.ApiSource;
import com.ipsearch.engine.entity.enums.AssetStatus;
import com.ipsearch.engine.entity.enums.IPType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * IPAsset entity mapped to ip_assets table.
 * Represents a patent or trademark with its main metadata.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"filings", "documents"})
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "ip_assets")
public class IPAsset {

    /**
     * Primary key (auto-generated).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Type of IP (PATENT or TRADEMARK).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private IPType type;

    /**
     * Public asset number (e.g., patent number or trademark registration).
     */
    @Column(name = "asset_number", nullable = false, length = 100)
    private String assetNumber;

    /**
     * Title of the IP asset.
     */
    @Column(name = "title", nullable = false)
    private String title;

    /**
     * Assignee (owner / applicant).
     */
    @Column(name = "assignee", length = 255)
    private String assignee;

    /**
     * Inventor or creator.
     */
    @Column(name = "inventor", length = 255)
    private String inventor;

    /**
     * Jurisdiction (e.g., US, EP, IN).
     */
    @Column(name = "jurisdiction", length = 50)
    private String jurisdiction;

    /**
     * Filing date of the IP asset.
     */
    @Column(name = "filing_date")
    private LocalDate filingDate;

    /**
     * Current status of the IP asset.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private AssetStatus status;

    /**
     * Classification / class for the asset.
     * For patents: IPC/CPC; for trademarks: Nice class.
     */
    @Column(name = "asset_class", length = 100)
    private String assetClass;

    /**
     * Additional details or description.
     * Stored as TEXT in PostgreSQL.
     */
    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    /**
     * External API source from which this record was obtained.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "api_source", length = 20)
    private ApiSource apiSource;

    /**
     * Last time this asset was updated in our system.
     */
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    /**
     * Legal status timeline (one asset -> many filings).
     */
    @OneToMany(
            mappedBy = "ipAsset",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Filing> filings = new ArrayList<>();

    /**
     * Documents attached to this IP asset (one asset -> many documents).
     */
    @OneToMany(
            mappedBy = "ipAsset",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<IPDocument> documents = new ArrayList<>();

    /**
     * Helper method to add a filing and keep both sides of the relationship in sync.
     */
    public void addFiling(Filing filing) {
        filings.add(filing);
        filing.setIpAsset(this);
    }

    /**
     * Helper method to remove a filing and keep both sides in sync.
     */
    public void removeFiling(Filing filing) {
        filings.remove(filing);
        filing.setIpAsset(null);
    }

    /**
     * Helper method to add a document to this asset.
     */
    public void addDocument(IPDocument document) {
        documents.add(document);
        document.setIpAsset(this);
    }

    /**
     * Helper method to remove a document from this asset.
     */
    public void removeDocument(IPDocument document) {
        documents.remove(document);
        document.setIpAsset(null);
    }
}



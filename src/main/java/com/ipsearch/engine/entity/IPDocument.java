package com.ipsearch.engine.entity;

import com.ipsearch.engine.entity.enums.DocumentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * IPDocument entity represents documents (attachments) associated with an IP asset.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "ipAsset")
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "ip_documents")
public class IPDocument {

    /**
     * Primary key (auto-generated).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Human-friendly document name.
     */
    @Column(name = "document_name", nullable = false, length = 255)
    private String documentName;

    /**
     * Type of document (PDF / OFFICE_ACTION / CERTIFICATE).
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 50)
    private DocumentType documentType;

    /**
     * URL or path where the document is stored.
     */
    @Column(name = "document_url", nullable = false, length = 1024)
    private String documentUrl;

    /**
     * Timestamp when the document was uploaded into the system.
     */
    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    /**
     * Many documents belong to one IP asset.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ip_asset_id", nullable = false)
    private IPAsset ipAsset;
}



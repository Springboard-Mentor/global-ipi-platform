package com.example.demo.ip.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ip_assets")
public class IPAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(unique = true)
    private String applicationNumber;
    private String country;
    private String assetType;
    private String ownerName;
    private String inventorName;
    private LocalDate filingDate;
    private LocalDate publicationDate;
    private String referenceSource;
    private LocalDate priorityDate;
    private LocalDate grantDate;
    @Column(name = "legal_status")
    private String legalStatus;
    private LocalDate updatedOn;
    @Column(length = 4000)
    private String abstractText;

    @PrePersist
    @PreUpdate
    private void onUpdate() {
        this.updatedOn = LocalDate.now();
    }

    public String getLegalStatus() {
        return legalStatus;
    }

    public void setLegalStatus(String legalStatus) {
        this.legalStatus = legalStatus;
    }

    public LocalDate getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(LocalDate updatedOn) {
        this.updatedOn = updatedOn;
    }

    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private java.util.List<LegalStatusEvent> legalStatusEvents;

    @Column(length = 500)
    private String patentLink;

    @Column(length = 500)
    private String pdfLink;

    @Column(length = 500)
    private String thumbnail;

    // getters & setters

    public java.util.List<LegalStatusEvent> getLegalStatusEvents() {
        return legalStatusEvents;
    }

    public void setLegalStatusEvents(java.util.List<LegalStatusEvent> legalStatusEvents) {
        this.legalStatusEvents = legalStatusEvents;
    }

    public LocalDate getPriorityDate() {
        return priorityDate;
    }

    public void setPriorityDate(LocalDate priorityDate) {
        this.priorityDate = priorityDate;
    }

    public LocalDate getGrantDate() {
        return grantDate;
    }

    public void setGrantDate(LocalDate grantDate) {
        this.grantDate = grantDate;
    }

    public String getPatentLink() {
        return patentLink;
    }

    public void setPatentLink(String patentLink) {
        this.patentLink = patentLink;
    }

    public String getPdfLink() {
        return pdfLink;
    }

    public void setPdfLink(String pdfLink) {
        this.pdfLink = pdfLink;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getAbstractText() {
        return abstractText;
    }

    public void setAbstractText(String abstractText) {
        this.abstractText = abstractText;
    }

    public String getReferenceSource() {
        return referenceSource;
    }

    public void setReferenceSource(String referenceSource) {
        this.referenceSource = referenceSource;
    }

    public LocalDate getPublicationDate() {
        return publicationDate;
    }

    public void setPublicationDate(LocalDate publicationDate) {
        this.publicationDate = publicationDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getAssetType() {
        return assetType;
    }

    public void setAssetType(String assetType) {
        this.assetType = assetType;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getInventorName() {
        return inventorName;
    }

    public void setInventorName(String inventorName) {
        this.inventorName = inventorName;
    }

    public LocalDate getFilingDate() {
        return filingDate;
    }

    public void setFilingDate(LocalDate filingDate) {
        this.filingDate = filingDate;
    }
}

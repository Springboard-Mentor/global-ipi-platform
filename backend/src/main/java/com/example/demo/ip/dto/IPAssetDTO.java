package com.example.demo.ip.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class IPAssetDTO {
    private Long id;
    private String title;
    private String assetType;
    private String applicationNumber;
    private String legalStatus;
    private String country;
    private LocalDate filingDate;
    private LocalDate publicationDate;
    private LocalDate priorityDate;
    private LocalDate grantDate;
    private LocalDate updatedOn;
    private String abstractText;
    private String ownerName;
    private String inventorName;
    private String referenceSource;
    private String patentLink;
    private String pdfLink;
    private String thumbnail;

      // getters & setters

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

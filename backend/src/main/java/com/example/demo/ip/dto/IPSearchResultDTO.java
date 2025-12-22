package com.example.demo.ip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//  DTO for IP search results
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IPSearchResultDTO {
    private Long id;
    private String title;
    private String assetType; // PATENT / TRADEMARK
    private String applicationNumber;
    private String status; // LIVE / DEAD / GRANTED etc
    private String country;
    private String filingDate;
    private String publicationDate;
    private String abstractText;
    private String ownerName;
    private String inventorName;

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

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Convenience constructor for basic fields
    public IPSearchResultDTO(String title, String assetType, String applicationNumber, String status) {
        this.title = title;
        this.assetType = assetType;
        this.applicationNumber = applicationNumber;
        this.status = status;
    }
}

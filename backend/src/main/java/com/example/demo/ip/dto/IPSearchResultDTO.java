package com.example.demo.ip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO for IP search results
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IPSearchResultDTO {

    private Long id;
    private String title;
    private String assetType;          // PATENT / TRADEMARK
    private String applicationNumber;
    private String status;             // LIVE / DEAD / GRANTED
    private String country;
    private String filingDate;         // yyyy-MM-dd
    private String publicationDate;
    private String abstractText;
    private String ownerName;
    private String inventorName;

    // Optional lightweight constructor
    public IPSearchResultDTO(String title, String assetType,
                             String applicationNumber, String status) {
        this.title = title;
        this.assetType = assetType;
        this.applicationNumber = applicationNumber;
        this.status = status;
    }
}

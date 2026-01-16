package com.example.demo.ip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO for external / search IP results (Google Patents style)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IPSearchResultDTO {

    private Long id;
    private String title;
    private String assetType; // PATENT / TRADEMARK
    private String applicationNumber;
    private String legalStatus; // FILED / GRANTED / REJECTED
    private String country;

    // Dates from external sources (string-based)
    private String filingDate; // yyyy-MM-dd
    private String publicationDate;
    private String priorityDate;
    private String grantDate;
    private String updatedOn;

    private String abstractText;
    private String ownerName;
    private String inventorName;

    private String referenceSource;
    private String patentLink;
    private String pdfLink;
    private String thumbnail;

    // Optional lightweight constructor
    public IPSearchResultDTO(
            String title,
            String assetType,
            String applicationNumber,
            String legalStatus) {
        this.title = title;
        this.assetType = assetType;
        this.applicationNumber = applicationNumber;
        this.legalStatus = legalStatus;
    }
}

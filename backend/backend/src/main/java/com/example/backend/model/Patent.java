package com.example.backend.model;

import lombok.Data;

@Data
public class Patent {
    private String ipRightIdentifier;
    private String title;
    private String abstractText;
    private String filingDate;
    // Add more fields as needed
}
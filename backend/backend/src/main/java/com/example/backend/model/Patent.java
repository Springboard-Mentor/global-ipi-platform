package com.example.backend.model;

import lombok.Data;

@Data
public class Patent {
    private String id;
    private String type;
    private String assetNumber;
    private String title;
    private String assignee;
    private String inventor;
    private String jurisdiction;
    private String filingDate;
    private String status;
    private String classInfo;
    private String details;
    private String apiSource;
    private String lastUpdated;
    private String ipRightIdentifier;
    private String abstractText;
}
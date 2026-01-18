package com.example.demo.filingtracker.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

@Data
public class TrackRequest {
    private String title;
    private String abstractText;
    private String inventors;
    private String assignee;
    private String applicationNumber;
    private String jurisdiction;
    private String ipType;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate filingDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate priorityDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate publicationDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate grantDate;
}

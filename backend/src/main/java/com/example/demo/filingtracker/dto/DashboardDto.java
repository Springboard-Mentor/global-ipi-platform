package com.example.demo.filingtracker.dto;

import lombok.Data;

@Data
public class DashboardDto {
    private long total;
    private long granted;
    private long renewalDue;
    private long expired;
}

package com.example.demo.admin.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AdminDashboardStatsDTO {
    private Map<String, Object> userStats; // total, active, newThisMonth
    private Map<String, Object> filingStats; // total, filed, granted
    private Map<String, Object> revenueStats; // total, monthly
    private Map<String, Object> apiHealth; // status, value
    
    private List<Map<String, Object>> userGrowthData; // name (Month), users (Count)
    private List<Map<String, Object>> filingStatusData; // name (Status), value (Count)
    private List<Map<String, Object>> platformActivity; // action, user, time, status
}

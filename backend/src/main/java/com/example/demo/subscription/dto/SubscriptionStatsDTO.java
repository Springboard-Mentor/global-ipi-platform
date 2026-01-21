package com.example.demo.subscription.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class SubscriptionStatsDTO {
    private Double monthlyRevenue;
    private long activeSubscriptions;
    private double churnRate;
    private double arpu; // Average Revenue Per User
    
    private List<Map<String, Object>> revenueTrends;
    private List<Map<String, Object>> planDistribution;
}

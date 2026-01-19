package com.example.demo.monitoring;

import lombok.Data;
import java.io.Serializable;
import java.util.List;

@Data
public class ActivityStatsData implements Serializable {
    private long totalUsers;
    private long activeUsers; // e.g. active in last 7 days
    private long newRegistrations; // last 7 days
    private long searchQueries; // total or custom
    private long patentViews; // total or custom
    private List<TopActivity> topActivities;

    @Data
    public static class TopActivity {
        private String activity;
        private long count;
        private String trend; // +10% etc
    }
}

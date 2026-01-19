package com.example.demo.monitoring;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class PatentTrendsData {
    private PatentStats patentStats;
    private List<CategoryTrend> trendingCategories;
    private List<JurisdictionStats> jurisdictions;
    private List<StatusDistribution> filingStatus;

    @Data
    public static class PatentStats {
        private long totalPatents;
        private long newFilings; // e.g. last 30 days
        private long grantedPatents;
        private long pendingApplications;
        private long rejectedApplications;
    }

    @Data
    public static class CategoryTrend {
        private String category;
        private long patents;
        private String growth;
    }

    @Data
    public static class JurisdictionStats {
        private String country;
        private long patents;
        private double percentage;
    }

    @Data
    public static class StatusDistribution {
        private String status;
        private long count;
        private String color;
    }
}

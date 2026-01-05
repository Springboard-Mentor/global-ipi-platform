package com.project.backend.service;

import com.project.backend.repository.IPAssetRepository;
import com.project.backend.entity.IPAsset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service to handle complex data aggregation for Milestone Three.
 * Directly addresses Legal Status and Landscape Visualization requirements.
 */
@Service
public class AnalyticsService {

    @Autowired
    private IPAssetRepository ipAssetRepository;

    /**
     * Calculates KPI summaries for the Legal Dashboard.
     * Prevents NaN% by checking total filing counts.
     */
    public Map<String, Object> getDashboardSummary() {
        List<IPAsset> allAssets = ipAssetRepository.findAll();
        long total = allAssets.size();
        
        long granted = allAssets.stream()
            .filter(a -> "Granted".equalsIgnoreCase(a.getStatus()) || "Active".equalsIgnoreCase(a.getStatus()))
            .count();
            
        long pending = allAssets.stream()
            .filter(a -> "Pending".equalsIgnoreCase(a.getStatus()))
            .count();
            
        long rejected = allAssets.stream()
            .filter(a -> "Rejected".equalsIgnoreCase(a.getStatus()) || "Expired".equalsIgnoreCase(a.getStatus()))
            .count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalFilings", total);
        summary.put("activePatents", granted);
        summary.put("pendingApplications", pending);
        summary.put("criticalAlerts", rejected);
        
        // Success Rate Calculation: (Granted / Total) * 100
        double successRate = total > 0 ? ((double) granted / total) * 100 : 0.0;
        summary.put("successRate", String.format("%.1f", successRate));
        
        return summary;
    }

    /**
     * Aggregates filings per year for the Filing Status Trends chart.
     */
    public List<Map<String, Object>> getTimelineData() {
        return ipAssetRepository.findAll().stream()
            .filter(a -> a.getFilingDate() != null)
            .collect(Collectors.groupingBy(a -> a.getFilingDate().getYear(), Collectors.counting()))
            .entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .map(e -> {
                Map<String, Object> map = new HashMap<>();
                map.put("year", e.getKey());
                map.put("innovations", e.getValue());
                return map;
            }).collect(Collectors.toList());
    }

    /**
     * Maps database rows to status distribution objects for PieCharts.
     */
    public List<Map<String, Object>> getStatusDistribution() {
        return ipAssetRepository.getStatusDistribution().stream()
            .map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", row[0] != null ? row[0] : "Unknown");
                map.put("value", row[1]);
                return map;
            }).collect(Collectors.toList());
    }

    /**
     * Retrieves raw jurisdictional counts for Landscape Visualization.
     */
    public List<Object[]> getJurisdictionData(String keyword) {
        return ipAssetRepository.getJurisdictionCounts(keyword);
    }
}
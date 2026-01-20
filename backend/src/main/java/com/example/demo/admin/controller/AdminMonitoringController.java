package com.example.demo.admin.controller;

import com.example.demo.monitoring.MonitoringService;
import com.example.demo.monitoring.SystemHealthData;
import com.example.demo.monitoring.TrafficData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin/monitoring")
@RequiredArgsConstructor
public class AdminMonitoringController {

    private final MonitoringService monitoringService;

    @GetMapping("/health")
    public ResponseEntity<SystemHealthData> getSystemHealth() {
        return ResponseEntity.ok(monitoringService.getHealthData());
    }

    @GetMapping("/activity")
    public ResponseEntity<com.example.demo.monitoring.ActivityStatsData> getActivityStats() {
        return ResponseEntity.ok(monitoringService.getActivityStats());
    }

    @GetMapping("/trends")
    public ResponseEntity<com.example.demo.monitoring.PatentTrendsData> getPatentTrends() {
        return ResponseEntity.ok(monitoringService.getPatentTrends());
    }

    @GetMapping("/traffic")
    public ResponseEntity<TrafficData> getTrafficData() {
        return ResponseEntity.ok(monitoringService.getTrafficData());
    }

    /**
     * INTEGRATED MONITORING DATA - Similar to IP Assets integration
     * Returns all monitoring data in a single response for frontend processing
     */
    @GetMapping("/all-data")
    public ResponseEntity<Map<String, Object>> getAllMonitoringData() {
        Map<String, Object> allData = new HashMap<>();

        // System Health Data
        allData.put("systemHealth", monitoringService.getHealthData());

        // Activity Stats
        allData.put("activityStats", monitoringService.getActivityStats());

        // Patent Trends
        allData.put("patentTrends", monitoringService.getPatentTrends());

        // Live Traffic Data
        allData.put("trafficData", monitoringService.getTrafficData());

        // Chart Data for all components
        Map<String, Object> chartData = new HashMap<>();
        chartData.put("traffic", monitoringService.getTrafficChartData());
        chartData.put("responsePerformance", monitoringService.getResponsePerformanceData());
        chartData.put("userActivity", monitoringService.getUserActivityData());
        chartData.put("featureUsage", monitoringService.getFeatureUsageData());
        chartData.put("sessionDuration", monitoringService.getSessionDurationData());
        chartData.put("filingTrends", monitoringService.getFilingTrendsData());
        chartData.put("processingTimes", monitoringService.getProcessingTimeData());
        chartData.put("categories", monitoringService.getCategoryData());
        chartData.put("grantRates", monitoringService.getGrantRateData());
        chartData.put("jurisdictions", monitoringService.getJurisdictionData());

        allData.put("chartData", chartData);

        return ResponseEntity.ok(allData);
    }

    // Individual chart endpoints (for backward compatibility)
    @GetMapping("/charts/traffic")
    public ResponseEntity<List<Map<String, Object>>> getTrafficChartData() {
        return ResponseEntity.ok(monitoringService.getTrafficChartData());
    }

    @GetMapping("/charts/response-performance")
    public ResponseEntity<List<Map<String, Object>>> getResponsePerformanceData() {
        return ResponseEntity.ok(monitoringService.getResponsePerformanceData());
    }

    @GetMapping("/charts/user-activity")
    public ResponseEntity<List<Map<String, Object>>> getUserActivityData() {
        return ResponseEntity.ok(monitoringService.getUserActivityData());
    }

    @GetMapping("/charts/feature-usage")
    public ResponseEntity<List<Map<String, Object>>> getFeatureUsageData() {
        return ResponseEntity.ok(monitoringService.getFeatureUsageData());
    }

    @GetMapping("/charts/session-duration")
    public ResponseEntity<List<Map<String, Object>>> getSessionDurationData() {
        return ResponseEntity.ok(monitoringService.getSessionDurationData());
    }

    @GetMapping("/charts/filing-trends")
    public ResponseEntity<List<Map<String, Object>>> getFilingTrendsData() {
        return ResponseEntity.ok(monitoringService.getFilingTrendsData());
    }

    @GetMapping("/charts/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategoryData() {
        return ResponseEntity.ok(monitoringService.getCategoryData());
    }

    @GetMapping("/charts/grant-rates")
    public ResponseEntity<List<Map<String, Object>>> getGrantRateData() {
        return ResponseEntity.ok(monitoringService.getGrantRateData());
    }

    @GetMapping("/charts/processing-times")
    public ResponseEntity<List<Map<String, Object>>> getProcessingTimeData() {
        return ResponseEntity.ok(monitoringService.getProcessingTimeData());
    }
}

package com.project.backend.controller;

import com.project.backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*") // Adjust to your frontend port
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/distribution")
    public ResponseEntity<List<Map<String, Object>>> getDistribution() {
        return ResponseEntity.ok(analyticsService.getStatusDistribution());
    }

    @GetMapping("/timeline")
    public ResponseEntity<List<Map<String, Object>>> getTimeline() {
        return ResponseEntity.ok(analyticsService.getTimelineData());
    }

    @GetMapping("/jurisdiction-stats")
    public ResponseEntity<List<Object[]>> getJurisdictionStats(@RequestParam(required = false) String keyword) {
        // Bridges to the repository method provided in your prompt
        return ResponseEntity.ok(analyticsService.getJurisdictionData(keyword));
    }
}
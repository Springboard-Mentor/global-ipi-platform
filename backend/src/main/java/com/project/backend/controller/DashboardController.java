package com.project.backend.controller;

import com.project.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
// ✅ UPDATED CORS: Explicitly allows your React Port (5173) to reach Port (5001)
@CrossOrigin(origins = "http://192.168.43.45:5173") 
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity() {
        return ResponseEntity.ok(dashboardService.getRecentActivity());
    }

    @GetMapping("/global-coverage")
    public ResponseEntity<List<Map<String, Object>>> getGlobalCoverage() {
        return ResponseEntity.ok(dashboardService.getGlobalCoverage());
    }

    @GetMapping("/upcoming-deadlines")
    public ResponseEntity<List<Map<String, Object>>> getUpcomingDeadlines() {
        return ResponseEntity.ok(dashboardService.getUpcomingDeadlines());
    }
}
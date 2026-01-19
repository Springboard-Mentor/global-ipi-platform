package com.example.demo.admin.controller;

import com.example.demo.monitoring.MonitoringService;
import com.example.demo.monitoring.SystemHealthData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

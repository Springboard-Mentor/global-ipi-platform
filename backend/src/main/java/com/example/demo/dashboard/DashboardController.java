package com.example.demo.dashboard;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/legal-status-summary")
    public Map<String, Long> legalStatusSummary() {
        return dashboardService.getLegalStatusSummary();
    }

    @GetMapping("/ip/{id}/legal-status-timeline")
    public List<LegalStatusTimelineDTO> legalStatusTimeline(@PathVariable Long id) {
        return dashboardService.getLegalStatusTimeline(id);
    }
}

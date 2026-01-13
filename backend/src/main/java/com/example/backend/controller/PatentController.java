package com.example.backend.controller;

import com.example.backend.model.Patent;
import com.example.backend.model.SearchRequest;
import com.example.backend.model.YearlyPatentCount;
import com.example.backend.service.PatentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patents")
@CrossOrigin(origins = "*")
public class PatentController {

    private final PatentService patentService;

    public PatentController(PatentService patentService) {
        this.patentService = patentService;
    }

    @GetMapping
    public ResponseEntity<List<Patent>> getAllPatents() {
        List<Patent> allPatents = patentService.getAllPatents();
        return ResponseEntity.ok(allPatents);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getPatentCount() {
        // Get total count of patents in local database
        long count = patentService.getPatentCount();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/yearly-counts")
    public ResponseEntity<List<YearlyPatentCount>> getYearlyPatentCounts() {
        // Get yearly patent counts for chart display
        List<YearlyPatentCount> yearlyCounts = patentService.getYearlyPatentCounts();
        return ResponseEntity.ok(yearlyCounts);
    }
    
    @GetMapping("/status-counts")
    public ResponseEntity<java.util.Map<String, Long>> getPatentStatusCounts() {
        // Get patent counts grouped by status for pie chart
        java.util.Map<String, Long> statusCounts = patentService.getPatentStatusCounts();
        return ResponseEntity.ok(statusCounts);
    }
    
    @GetMapping("/status-counts-by-date")
    public ResponseEntity<List<java.util.Map<String, Object>>> getPatentStatusCountsByDate() {
        // Get patent counts grouped by status and date
        List<java.util.Map<String, Object>> statusCountsByDate = patentService.getPatentStatusCountsByDate();
        return ResponseEntity.ok(statusCountsByDate);
    }

    @GetMapping("/local")
    public ResponseEntity<List<Patent>> getAllLocalPatents() {
        // Get all patents from local database without search query
        List<Patent> results = patentService.searchInLocalDatabase("");
        return ResponseEntity.ok(results);
    }

    @PostMapping("/search")
    public ResponseEntity<List<Patent>> searchPatents(@RequestBody SearchRequest request) {
        // request.query should be the patent_id, e.g., "patent/US11734097B1/en"
        List<Patent> results = patentService.quickSearch(request);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{patentId}")
    public ResponseEntity<Patent> getPatent(@PathVariable String patentId) {
        Patent patent = patentService.getPatentById(patentId);
        if (patent != null) {
            return ResponseEntity.ok(patent);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/count-by-state")
    public ResponseEntity<Long> getPatentCountByState(@RequestParam String state) {
        // Get count of patents from a specific state
        long count = patentService.getPatentCountByState(state);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/revenue")
    public ResponseEntity<java.util.Map<String, Object>> getPatentFilingRevenue(@RequestParam String filter) {
        // Get patent filing revenue with filter (weekly or monthly)
        java.util.Map<String, Object> revenue = patentService.getPatentFilingRevenue(filter);
        return ResponseEntity.ok(revenue);
    }
}

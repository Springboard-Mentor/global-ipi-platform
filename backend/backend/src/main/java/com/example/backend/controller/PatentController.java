package com.example.backend.controller;

import com.example.backend.model.Patent;
import com.example.backend.model.SearchRequest;
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

    @PostMapping("/search/local")
    public ResponseEntity<List<Patent>> searchLocalDatabase(@RequestBody SearchRequest request) {
        // Search only in local PostgreSQL database (my_project_db)
        List<Patent> results = patentService.searchInLocalDatabase(request.getQuery());
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
}
package com.example.backend.controller;

import com.example.backend.model.Patent;
import com.example.backend.model.SearchRequest;
import com.example.backend.service.PatentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patents")
public class PatentController {

    private final PatentService patentService;

    public PatentController(PatentService patentService) {
        this.patentService = patentService;
    }

    @PostMapping("/search")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<Patent>> searchPatents(@RequestBody SearchRequest request) {
        // request.query should be the patent_id, e.g., "patent/US11734097B1/en"
        List<Patent> results = patentService.quickSearch(request);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{patentId}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Patent> getPatent(@PathVariable String patentId) {
        Patent patent = patentService.getPatentById(patentId);
        if (patent != null) {
            return ResponseEntity.ok(patent);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
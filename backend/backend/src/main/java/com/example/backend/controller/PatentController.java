package com.example.backend.controller;

import com.example.backend.model.Patent;
import com.example.backend.model.SearchRequest;
import com.example.backend.service.PatentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.List;

@RestController
@RequestMapping("/api/patents")
@CrossOrigin(origins = "http://localhost:5173")
public class PatentController {

    private final PatentService patentService;

    public PatentController(PatentService patentService) {
        this.patentService = patentService;
    }

    @PostMapping("/search")
    public ResponseEntity<List<Patent>> searchPatents(@RequestBody SearchRequest request) {
        List<Patent> results = patentService.quickSearch(request);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{ipRightIdentifier}")
    public Mono<ResponseEntity<Patent>> getPatent(@PathVariable String ipRightIdentifier) {
        return patentService.getPatent(ipRightIdentifier)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
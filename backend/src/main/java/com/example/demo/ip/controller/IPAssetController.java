package com.example.demo.ip.controller;

import com.example.demo.ip.dto.IPAssetDTO;
import com.example.demo.ip.service.IPAssetService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ip-assets")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class IPAssetController {

    private final IPAssetService service;

    /**
     * IP Activity Page – Get all IP assets
     */
    @GetMapping
    public List<IPAssetDTO> getAll() {
        return service.getAllAssets();
    }

    /**
     * IP Activity Page – Search (paginated)
     */
    @GetMapping("/search")
    public Page<IPAssetDTO> search(
            @RequestParam String q,
            Pageable pageable) {
        return service.search(q, pageable);
    }

    /**
     * IP Activity Page – Get by ID
     */
    @GetMapping("/{id}")
    public IPAssetDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    /**
     * Legal Status Dashboard – Summary
     */
    @GetMapping("/legal-status-summary")
    public Map<String, Long> getStatusSummary() {
        return service.getStatusSummary();
    }
}

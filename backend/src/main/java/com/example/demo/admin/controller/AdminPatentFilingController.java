package com.example.demo.admin.controller;

import com.example.demo.filing.dto.PatentFilingResponse;
import com.example.demo.filing.service.PatentFilingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/patent-filings")
@RequiredArgsConstructor
public class AdminPatentFilingController {

    private final PatentFilingService filingService;

    @GetMapping("/{id}")
    public ResponseEntity<PatentFilingResponse> getFilingById(@PathVariable Long id) {
        // In a real app, add @PreAuthorize("hasRole('ADMIN')")
        return ResponseEntity.ok(filingService.getFilingByIdAdmin(id));
    }
}

package com.example.demo.ip.controller;

import com.example.demo.ip.dto.IPSearchRequest;
import com.example.demo.ip.dto.IPSearchResultDTO;
import com.example.demo.ip.service.IPSearchService;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ip")
@RequiredArgsConstructor
public class IPSearchController {

    private final IPSearchService ipSearchService;

    @PostMapping("/search")
    public ResponseEntity<List<IPSearchResultDTO>> search(
           @Valid @RequestBody IPSearchRequest request) {
        List<IPSearchResultDTO> results = ipSearchService.search(request);
        System.out.println("API returning " + results.size() + " results");
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IPSearchResultDTO> getIPDetails(@PathVariable Long id) {
        return ResponseEntity.ok(ipSearchService.getIPDetails(id));
    }
}

package com.project.backend.controller;

import com.project.backend.entity.IPAsset;
import com.project.backend.service.IPAssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
@Tag(name = "Search API", description = "Search Patents & Trademarks with Analytics")
public class SearchController {

    private final IPAssetService ipAssetService;

    public SearchController(IPAssetService ipAssetService) {
        this.ipAssetService = ipAssetService;
    }

    // ===========================
    // 🔍 MAIN SEARCH API (UPDATED FOR FILTERS)
    // ===========================
    @GetMapping
    @Operation(summary = "Unified Search with Advanced Filters")
    public Page<IPAsset> search(
            @RequestParam(name = "q", required = false, defaultValue = "") String keyword,
            @RequestParam(name = "source", required = false, defaultValue = "local") String source,
            @RequestParam(name = "type", required = false, defaultValue = "ALL") String type,
            
            // ✅ NEW FILTERS ADDED
            @RequestParam(required = false) String jurisdictions,
            @RequestParam(required = false) String statuses,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,

            // Pagination & Sorting
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "filingDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection
    ) {

        System.out.println(">>> 🟢 SEARCH REQUEST | q=" + keyword + " | filters=" + jurisdictions + "/" + statuses);

        return ipAssetService.search(
                keyword, type, source, jurisdictions, statuses, dateFrom, dateTo, 
                page, size, sortBy, sortDirection
        );
    }

    // ===========================
    // 📊 ANALYTICS API
    // ===========================
    @GetMapping("/analysis")
    public List<IPAsset> getAnalysisData() {
        return ipAssetService.getAllAssetsForAnalysis();
    }
}
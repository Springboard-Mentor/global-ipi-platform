package com.project.backend.controller;

import com.project.backend.entity.IPAsset;
import com.project.backend.service.IPAssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
@Tag(name = "Search API", description = "Search Patents & Trademarks")
public class SearchController {

    // ✅ CHANGED: Use IPAssetService (which handles Saving) instead of UnifiedSearchService
    private final IPAssetService ipAssetService;

    public SearchController(IPAssetService ipAssetService) {
        this.ipAssetService = ipAssetService;
    }

    @GetMapping
    @Operation(summary = "Unified Search with DB Persistence")
    public Page<IPAsset> search(
            @RequestParam(name = "q", required = false, defaultValue = "") String keyword,
            @RequestParam(name = "source", required = false, defaultValue = "local") String source,
            @RequestParam(name = "type", required = false, defaultValue = "ALL") String type,
            
            // ✅ ADDED: Pagination & Sorting Params required by IPAssetService
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "filingDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection
    ) {

        System.out.println(">>> 🟢 SEARCH REQUEST | q=" + keyword + 
                           " | source=" + source + 
                           " | type=" + type + 
                           " | page=" + page);

        // ✅ CALLS THE FIXED SERVICE: Fetch API -> Save DB -> Return Page<IPAsset>
        return ipAssetService.search(keyword, type, source, page, size, sortBy, sortDirection);
    }
}
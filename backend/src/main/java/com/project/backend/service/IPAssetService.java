package com.project.backend.service;

import com.project.backend.dto.PatentDTO;
import com.project.backend.entity.IPAsset;
import com.project.backend.repository.IPAssetRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class IPAssetService {

    private final IPAssetRepository ipAssetRepository;
    private final ExternalIPService externalIPService; // ✅ Uses your existing API service

    public IPAssetService(IPAssetRepository ipAssetRepository, ExternalIPService externalIPService) {
        this.ipAssetRepository = ipAssetRepository;
        this.externalIPService = externalIPService;
    }

    public Page<IPAsset> search(String keyword, String type, String source, int page, int size, String sortBy, String sortDirection) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        // 🟢 API SEARCH CASE
        if ("api".equalsIgnoreCase(source)) {
            System.out.println("🌐 Calling External API for: " + keyword);
            
            // 1. Fetch from SerpApi
            List<PatentDTO> apiResults = externalIPService.searchSerpApi(keyword);
            
            // 2. Save to Database (Transactional)
            saveApiResultsToDatabase(apiResults);
            
            // 3. Return Data from Database marked as 'api'
            return ipAssetRepository.searchAssets(keyword, type, "api", pageable);
        }

        // 🔵 LOCAL SEARCH CASE
        if (keyword == null) keyword = "";
        if (type == null) type = "ALL";
        if (source == null) source = "local";

        System.out.println("📦 Searching Local DB for: " + keyword);
        // Repository query updated to include saved API results in 'local' search
        return ipAssetRepository.searchAssets(keyword, type, "local", pageable);
    }

    @Transactional // ✅ Ensures data is committed to DB
    public void saveApiResultsToDatabase(List<PatentDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            System.out.println("⚠️ No results to save.");
            return;
        }

        int savedCount = 0;
        for (PatentDTO dto : dtos) {
            try {
                String assetId = dto.getAssetNumber();
                if (assetId == null || assetId.isEmpty()) assetId = dto.getId();

                // ✅ Duplicate Check using optimized Repository method
                if (!ipAssetRepository.existsByAssetNumber(assetId)) {
                    
                    IPAsset asset = new IPAsset();
                    asset.setAssetNumber(assetId);
                    asset.setTitle(truncate(dto.getTitle(), 255));
                    asset.setDetails(truncate(dto.getAbstractText(), 1000));
                    asset.setType("PATENT");
                    asset.setStatus("ACTIVE");
                    
                    asset.setJurisdiction(dto.getJurisdiction() != null ? dto.getJurisdiction() : "US");
                    asset.setAssignee(truncate(dto.getAssignee(), 255));
                    asset.setInventor(truncate(dto.getInventor(), 255));
                    
                    asset.setFilingDate(parseDate(dto.getFilingDate()));
                    asset.setApiSource("api"); // ✅ Marks as API data
                    asset.setLastUpdated(LocalDateTime.now());

                    ipAssetRepository.save(asset);
                    savedCount++;
                }
            } catch (Exception e) {
                System.err.println("Error saving asset: " + e.getMessage());
            }
        }
        System.out.println("💾 Saved " + savedCount + " new records from Real API.");
    }

    private String truncate(String val, int length) {
        if (val == null) return null;
        if (val.length() > length) return val.substring(0, length - 3) + "...";
        return val;
    }

    private LocalDateTime parseDate(String dateStr) {
        try {
            if (dateStr == null || dateStr.isEmpty()) return LocalDateTime.now();
            return LocalDate.parse(dateStr, DateTimeFormatter.ISO_DATE).atStartOfDay();
        } catch (Exception e) {
            return LocalDateTime.now();
        }
    }
}
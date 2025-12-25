package com.project.backend.service;

import com.project.backend.dto.GeoLocationDTO;
import com.project.backend.dto.PatentDTO;
import com.project.backend.entity.IPAsset;
import com.project.backend.repository.IPAssetRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class IPAssetService {

    private final IPAssetRepository ipAssetRepository;
    private final ExternalIPService externalIPService;

    public IPAssetService(IPAssetRepository ipAssetRepository, ExternalIPService externalIPService) {
        this.ipAssetRepository = ipAssetRepository;
        this.externalIPService = externalIPService;
    }

    /**
     * Fetch geographic distribution for the Map view.
     * Aggregates counts by jurisdiction based on a search keyword.
     */
    public List<GeoLocationDTO> getGeoDistribution(String keyword) {
        List<Object[]> results = ipAssetRepository.getJurisdictionCounts(keyword);
        List<GeoLocationDTO> distribution = new ArrayList<>();

        for (Object[] row : results) {
            GeoLocationDTO dto = new GeoLocationDTO();
            dto.setJurisdiction((String) row[0]);
            
            // Extract the count from the query result
            int countValue = ((Long) row[1]).intValue();
            dto.setCount(countValue);
            
            // FIX: Cast int to long to match the DTO field type
            dto.setPatentCount((long) countValue); 
            
            distribution.add(dto);
        }
        return distribution;
    }

    /**
     * Core search logic handling both Local DB and External API.
     */
    public Page<IPAsset> search(String keyword, String type, String source, int page, int size, String sortBy, String sortDirection) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        // API SEARCH CASE: Fetch from external source and sync to local DB
        if ("api".equalsIgnoreCase(source)) {
            System.out.println("🌐 Calling External API for: " + keyword);
            
            List<PatentDTO> apiResults = externalIPService.searchSerpApi(keyword);
            saveApiResultsToDatabase(apiResults);
            
            // Return saved data marked as 'api' from local storage
            return ipAssetRepository.searchAssets(keyword, type, "api", pageable);
        }

        // LOCAL SEARCH CASE: Standard database search
        if (keyword == null) keyword = "";
        if (type == null) type = "ALL";
        if (source == null) source = "local";

        System.out.println("📦 Searching Local DB for: " + keyword);
        return ipAssetRepository.searchAssets(keyword, type, source, pageable);
    }

    /**
     * Persists API results to the local database.
     * Transactional ensures data consistency.
     */
    @Transactional
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

                // Duplicate Check: Only save if the asset doesn't already exist
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
                    asset.setApiSource("api"); // Mark as API data for filtering
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

    /**
     * Helper: Truncates strings to prevent Database column overflow errors.
     */
    private String truncate(String val, int length) {
        if (val == null) return null;
        if (val.length() > length) return val.substring(0, length - 3) + "...";
        return val;
    }

    /**
     * Helper: Safely parses various date formats into LocalDateTime.
     */
    private LocalDateTime parseDate(String dateStr) {
        try {
            if (dateStr == null || dateStr.isEmpty()) return LocalDateTime.now();
            return LocalDate.parse(dateStr, DateTimeFormatter.ISO_DATE).atStartOfDay();
        } catch (Exception e) {
            return LocalDateTime.now();
        }
    }
}
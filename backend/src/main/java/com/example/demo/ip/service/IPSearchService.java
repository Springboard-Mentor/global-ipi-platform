package com.example.demo.ip.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;

import com.example.demo.ip.client.ExternalPatentClient;
import com.example.demo.ip.dto.IPSearchRequest;
import com.example.demo.ip.dto.IPSearchResultDTO;
import com.example.demo.ip.entity.IPAsset;
import com.example.demo.ip.exception.IPAssetNotFoundException;
import com.example.demo.ip.repository.IPAssetRepository;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class IPSearchService {

    private static final int PAGE_SIZE = 20;

    private final ExternalPatentClient externalPatentClient;

    private final IPAssetRepository repository;
    private final com.example.demo.monitoring.MonitoringService monitoringService;

    public IPSearchResultDTO getIPDetails(Long id) {
        monitoringService.recordPatentView();
        IPAsset asset = repository.findById(id)
                .orElseThrow(() -> new IPAssetNotFoundException("IP Asset not found with id: " + id));

        return mapToDTO(asset);
    }

    public List<IPSearchResultDTO> search(IPSearchRequest request) {
        monitoringService.recordSearch();
        if (request == null || request.getQuery() == null || request.getQuery().isBlank()) {
            return List.of();
        }
        
        String query = request.getQuery().trim();
        String source = request.getSource() == null ? "EXTERNAL" : request.getSource().trim();

        if ("LOCAL".equalsIgnoreCase(source)) {
            log.info("Fetching data from LOCAL DATABASE");
            List<IPAsset> cachedAssets = repository.findByTitleContainingIgnoreCaseOrApplicationNumberContainingIgnoreCase(query, query);
            
            if (cachedAssets.isEmpty()) return List.of();

            return cachedAssets.stream().map(this::mapToDTO).toList();
        }

        log.info("Fetching data from GOOGLE PATENTS (SerpAPI)");
        List<IPSearchResultDTO> results = new ArrayList<>();
        for (int page = 0; page < 3; page++) {
            List<IPSearchResultDTO> pageResults = externalPatentClient.searchPatents(query, PAGE_SIZE);
            if (pageResults == null || pageResults.isEmpty()) break;
            results.addAll(pageResults);
        }

        if (results.isEmpty()) {
             // Fallback to local
             return repository.findByTitleContainingIgnoreCase(query, PageRequest.of(0, PAGE_SIZE))
                    .getContent().stream()
                    .map(this::mapToDTO)
                    .toList();
        }

        // Cache External Results
        List<IPAsset> assets = results.stream()
                .map(this::mapToEntity)
                .filter(asset -> asset.getApplicationNumber() != null && !repository.existsByApplicationNumber(asset.getApplicationNumber()))
                .toList();
        
        if (!assets.isEmpty()) {
            List<IPAsset> savedAssets = repository.saveAll(assets);
            // Sync DTOs with saved IDs and data
            for (IPSearchResultDTO dto : results) {
                 savedAssets.stream()
                     .filter(s -> s.getApplicationNumber() != null && s.getApplicationNumber().equals(dto.getApplicationNumber()))
                     .findFirst()
                     .ifPresent(s -> {
                         dto.setId(s.getId());
                         dto.setUpdatedOn(s.getUpdatedOn() != null ? s.getUpdatedOn().toString() : null);
                     });
                 
                 // Ensure status logic for display match the saved entity logic
                 String legalStatus = deriveStatus(
                     dto.getFilingDate() != null ? parseDate(dto.getFilingDate()) : null,
                     dto.getGrantDate() != null ? parseDate(dto.getGrantDate()) : null
                 );
                 dto.setLegalStatus(legalStatus);
            }
        } else {
             // For results that already existed
             for (IPSearchResultDTO dto : results) {
                 if (dto.getId() == null && dto.getApplicationNumber() != null) {
                     repository.findByApplicationNumber(dto.getApplicationNumber()).ifPresent(existing -> {
                         dto.setId(existing.getId());
                         dto.setLegalStatus(existing.getLegalStatus());
                         dto.setUpdatedOn(existing.getUpdatedOn() != null ? existing.getUpdatedOn().toString() : null);
                     });
                 }
             }
        }
        
        return results;
    }
    
    private IPSearchResultDTO mapToDTO(IPAsset asset) {
        IPSearchResultDTO dto = new IPSearchResultDTO();
        dto.setId(asset.getId());
        dto.setTitle(asset.getTitle());
        dto.setApplicationNumber(asset.getApplicationNumber());
        dto.setCountry(asset.getCountry());
        dto.setLegalStatus(asset.getLegalStatus());
        dto.setAssetType(asset.getAssetType());
        dto.setOwnerName(asset.getOwnerName());
        dto.setInventorName(asset.getInventorName());
        dto.setReferenceSource(asset.getReferenceSource());
        dto.setFilingDate(asset.getFilingDate() != null ? asset.getFilingDate().toString() : null);
        dto.setPublicationDate(asset.getPublicationDate() != null ? asset.getPublicationDate().toString() : null);
        dto.setPriorityDate(asset.getPriorityDate() != null ? asset.getPriorityDate().toString() : null);
        dto.setGrantDate(asset.getGrantDate() != null ? asset.getGrantDate().toString() : null);
        dto.setUpdatedOn(asset.getUpdatedOn() != null ? asset.getUpdatedOn().toString() : null);
        dto.setAbstractText(asset.getAbstractText());
        dto.setPatentLink(asset.getPatentLink());
        dto.setPdfLink(asset.getPdfLink());
        dto.setThumbnail(asset.getThumbnail());
        return dto;
    }

    private IPAsset mapToEntity(IPSearchResultDTO dto) {
        IPAsset asset = new IPAsset();
        asset.setTitle(dto.getTitle());
        asset.setAssetType(dto.getAssetType());
        asset.setApplicationNumber(dto.getApplicationNumber());
        asset.setCountry(dto.getCountry());
        asset.setOwnerName(dto.getOwnerName());
        asset.setInventorName(dto.getInventorName());
        asset.setReferenceSource(dto.getReferenceSource());
        asset.setAbstractText(dto.getAbstractText());

        asset.setFilingDate(parseDate(dto.getFilingDate()));
        asset.setPublicationDate(parseDate(dto.getPublicationDate()));
        asset.setPriorityDate(parseDate(dto.getPriorityDate()));
        asset.setGrantDate(parseDate(dto.getGrantDate()));

        asset.setPatentLink(dto.getPatentLink());
        asset.setPdfLink(dto.getPdfLink());
        asset.setThumbnail(dto.getThumbnail());
        
        asset.setLegalStatus(deriveStatus(asset.getFilingDate(), asset.getGrantDate()));
        return asset;
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) return null;
        try {
            return LocalDate.parse(dateStr);
        } catch (Exception e) {
            return null;
        }
    }

    private String deriveStatus(LocalDate filing, LocalDate grant) {
        if (grant != null) return "GRANTED";
        if (filing != null && filing.plusYears(20).isBefore(LocalDate.now())) return "EXPIRED";
        return "FILED";
    }
}

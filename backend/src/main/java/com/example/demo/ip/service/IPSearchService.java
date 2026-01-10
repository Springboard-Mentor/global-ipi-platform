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

    public IPSearchResultDTO getIPDetails(Long id) {
        IPAsset asset = repository.findById(id)
                .orElseThrow(() -> new IPAssetNotFoundException("IP Asset not found with id: " + id));

        IPSearchResultDTO dto = new IPSearchResultDTO();
        // Map asset fields into DTO
        dto.setId(asset.getId());
        dto.setTitle(asset.getTitle());
        dto.setApplicationNumber(asset.getApplicationNumber());
        dto.setCountry(asset.getCountry());
        dto.setAssetType(asset.getAssetType());
        dto.setOwnerName(asset.getOwnerName());
        dto.setInventorName(asset.getInventorName());
        dto.setReferenceSource(asset.getReferenceSource());

        dto.setFilingDate(asset.getFilingDate() != null ? asset.getFilingDate().toString() : null);
        dto.setPublicationDate(asset.getPublicationDate() != null ? asset.getPublicationDate().toString() : null);
        dto.setPriorityDate(asset.getPriorityDate() != null ? asset.getPriorityDate().toString() : null);

        // Ensure grantDate is populated in the DTO if present
        dto.setGrantDate(asset.getGrantDate() != null ? asset.getGrantDate().toString() : null);

        dto.setPatentLink(asset.getPatentLink());
        dto.setPdfLink(asset.getPdfLink());
        dto.setThumbnail(asset.getThumbnail());

        // Derive status consistently here so frontend sees the same logic as the search cache:
        // 1) If grant date exists => GRANTED
        // 2) Else if expiry (filingDate + 20 years) is before today => EXPIRED
        // 3) Otherwise => FILED
        String derivedStatus = "FILED";
        LocalDate filing = asset.getFilingDate();
        LocalDate grant = asset.getGrantDate();
        LocalDate expiry = null;
        if (filing != null) expiry = filing.plusYears(20);
        else if (grant != null) expiry = grant.plusYears(20);

        if (grant != null) derivedStatus = "GRANTED";
        else if (expiry != null && expiry.isBefore(LocalDate.now())) derivedStatus = "EXPIRED";
        else derivedStatus = "FILED";

        dto.setStatus(derivedStatus);

        return dto;
    }

    public List<IPSearchResultDTO> search(IPSearchRequest request) {

        // 🔒 Basic validation
        if (request == null || request.getQuery() == null || request.getQuery().isBlank()) {
            return List.of();
        }

        String query = request.getQuery().trim();

        // 🔹 Normalize source
        String source = request.getSource() == null
                ? "EXTERNAL"
                : request.getSource().trim();

        if ("LOCAL".equalsIgnoreCase(source)) {
            log.info("Fetching data from LOCAL DATABASE");
        } else {
            log.info("Fetching data from GOOGLE PATENTS (SerpAPI)");
        }

        // =====================================================
        // 1️⃣ LOCAL DATABASE SEARCH
        // =====================================================
        if ("LOCAL".equalsIgnoreCase(source)) {

            List<IPAsset> cachedAssets = repository
                    .findByTitleContainingIgnoreCaseOrApplicationNumberContainingIgnoreCase(
                            query, query);

            if (cachedAssets.isEmpty()) {
                return List.of();
            }

            return cachedAssets.stream()
                    .map(assetDto -> {
                        IPSearchResultDTO dto = new IPSearchResultDTO();
                        dto.setId(assetDto.getId());
                        dto.setTitle(assetDto.getTitle());
                        dto.setApplicationNumber(assetDto.getApplicationNumber());
                        dto.setCountry(assetDto.getCountry());
                        dto.setStatus(assetDto.getStatus());
                        dto.setAssetType(assetDto.getAssetType());
                        dto.setOwnerName(assetDto.getOwnerName());
                        dto.setInventorName(assetDto.getInventorName());
                        dto.setReferenceSource(assetDto.getReferenceSource());
                        dto.setFilingDate(
                                assetDto.getFilingDate() != null
                                        ? assetDto.getFilingDate().toString()
                                        : null);
                        dto.setPublicationDate(
                                assetDto.getPublicationDate() != null
                                        ? assetDto.getPublicationDate().toString()
                                        : null);
                        return dto;
                    })
                    .toList();

        }

        // =====================================================
        // 2️⃣ EXTERNAL SOURCE (SerpAPI / Google Patents)
        // =====================================================
        List<IPSearchResultDTO> results = new ArrayList<>();

        // int MAX_PAGES = 10; // 200 results max

        // for (int page = 0; page < MAX_PAGES; page++) {
        // List<IPSearchResultDTO> pageResults =
        // externalPatentClient.searchPatents(query, PAGE_SIZE, page);

        // if (pageResults.isEmpty()) break;

        // results.addAll(pageResults);
        // }

        for (int page = 0; page < 3; page++) { // 3 pages = max 60 results
            List<IPSearchResultDTO> pageResults = externalPatentClient.searchPatents(query, PAGE_SIZE, page);

            if (pageResults == null || pageResults.isEmpty()) {
                break;
            }

            results.addAll(pageResults);
        }

        if (results == null || results.isEmpty()) {
            // fallback to local DB
            return repository.findByTitleContainingIgnoreCase(
                    query,
                    PageRequest.of(0, PAGE_SIZE)).

                    getContent().stream()
                    .map(asset -> {
                        IPSearchResultDTO dto = new IPSearchResultDTO();
                        dto.setId(asset.getId());
                        dto.setTitle(asset.getTitle());
                        dto.setApplicationNumber(asset.getApplicationNumber());
                        dto.setCountry(asset.getCountry());
                        dto.setStatus(asset.getStatus());
                        dto.setAssetType(asset.getAssetType());
                        dto.setOwnerName(asset.getOwnerName());
                        dto.setInventorName(asset.getInventorName());
                        dto.setFilingDate(asset.getFilingDate() != null ? asset.getFilingDate().toString() : null);
                        dto.setPublicationDate(
                                asset.getPublicationDate() != null ? asset.getPublicationDate().toString() : null);
                        // dto.setAbstractText(asset.getAbstractText());
                        return dto;
                    })
                    .toList();
        }

        // =====================================================
        // 3️⃣ CACHE EXTERNAL RESULTS INTO DB (derive status & dates)
        // =====================================================
        List<IPAsset> assets = results.stream()
                .map(dto -> {
                    IPAsset asset = new IPAsset();
                    asset.setTitle(dto.getTitle());
                    asset.setAssetType(dto.getAssetType());
                    asset.setApplicationNumber(dto.getApplicationNumber());
                    asset.setCountry(dto.getCountry());
                    asset.setOwnerName(dto.getOwnerName());
                    asset.setInventorName(dto.getInventorName());
                    asset.setReferenceSource(dto.getReferenceSource());

                    // ----- Parse dates if present -----
                    LocalDate filing = null;
                    LocalDate grant = null;
                    if (dto.getFilingDate() != null) {
                        filing = LocalDate.parse(dto.getFilingDate());
                        asset.setFilingDate(filing);
                    }

                    if (dto.getPublicationDate() != null) {
                        asset.setPublicationDate(LocalDate.parse(dto.getPublicationDate()));
                    }

                    if (dto.getPriorityDate() != null) {
                        asset.setPriorityDate(LocalDate.parse(dto.getPriorityDate()));
                    }

                    if (dto.getGrantDate() != null) {
                        grant = LocalDate.parse(dto.getGrantDate());
                        asset.setGrantDate(grant);
                    }

                    asset.setPatentLink(dto.getPatentLink());
                    asset.setPdfLink(dto.getPdfLink());
                    asset.setThumbnail(dto.getThumbnail());

                    // ----- Derive status using rules:
                    // 1) If grant date is present => GRANTED
                    // 2) Else if expiry date (filingDate + 20 years) is before today => EXPIRED
                    // 3) Otherwise => FILED
                    // Note: we use filing date to compute expiry when available; if filing date is missing
                    // but grant date exists, we still treat as GRANTED above.
                    String derivedStatus = "FILED";
                    LocalDate expiry = null;
                    if (filing != null) {
                        expiry = filing.plusYears(20);
                    } else if (grant != null) {
                        // If filing date missing, fall back to grant date for expiry calculation
                        expiry = grant.plusYears(20);
                    }

                    if (grant != null) {
                        derivedStatus = "GRANTED";
                    } else if (expiry != null && expiry.isBefore(LocalDate.now())) {
                        derivedStatus = "EXPIRED";
                    } else {
                        derivedStatus = "FILED";
                    }

                    asset.setStatus(derivedStatus);

                    return asset;
                })
                .filter(asset -> asset.getApplicationNumber() != null &&
                        !repository.existsByApplicationNumber(asset.getApplicationNumber()))
                .toList();

        if (!assets.isEmpty()) {
            repository.saveAll(assets);
        }

        // =====================================================
        // 4️⃣ RETURN RESULTS TO FRONTEND
        // =====================================================
        // 4️⃣ Derive and set status on returned DTOs as well so frontend sees
        //    the same status logic without waiting for DB cache refresh.
        //    This mirrors the rules used when caching to DB above.
        // =====================================================
        for (IPSearchResultDTO dto : results) {
            LocalDate filing = dto.getFilingDate() != null ? LocalDate.parse(dto.getFilingDate()) : null;
            LocalDate grant = dto.getGrantDate() != null ? LocalDate.parse(dto.getGrantDate()) : null;
            LocalDate expiry = null;
            if (filing != null) expiry = filing.plusYears(20);
            else if (grant != null) expiry = grant.plusYears(20);

            String derivedStatus;
            if (grant != null) {
                derivedStatus = "GRANTED";
            } else if (expiry != null && expiry.isBefore(LocalDate.now())) {
                derivedStatus = "EXPIRED";
            } else {
                derivedStatus = "FILED";
            }

            dto.setStatus(derivedStatus);
        }

        return results;
    }
}

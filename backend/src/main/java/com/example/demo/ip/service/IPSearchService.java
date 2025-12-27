package com.example.demo.ip.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.example.demo.ip.client.ExternalPatentClient;
import com.example.demo.ip.dto.IPSearchRequest;
import com.example.demo.ip.dto.IPSearchResultDTO;
import com.example.demo.ip.entity.IPAsset;
import com.example.demo.ip.exception.IPAssetNotFoundException;
import com.example.demo.ip.mapper.IPAssetMapper;
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
        dto.setId(asset.getId());
        dto.setTitle(asset.getTitle());
        dto.setApplicationNumber(asset.getApplicationNumber());
        dto.setCountry(asset.getCountry());
        dto.setStatus(asset.getStatus());
        dto.setAssetType(asset.getAssetType());
        dto.setOwnerName(asset.getOwnerName());
        dto.setInventorName(asset.getInventorName());
        dto.setFilingDate(asset.getFilingDate() != null ? asset.getFilingDate().toString() : null);
        dto.setReferenceSource(dto.getReferenceSource());
        if (dto.getPriorityDate() != null) {
            asset.setPriorityDate(LocalDate.parse(dto.getPriorityDate()));
        }

        if (dto.getGrantDate() != null) {
            asset.setGrantDate(LocalDate.parse(dto.getGrantDate()));
        }

        asset.setPatentLink(dto.getPatentLink());
        asset.setPdfLink(dto.getPdfLink());
        asset.setThumbnail(dto.getThumbnail());

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
        // 3️⃣ CACHE EXTERNAL RESULTS INTO DB
        // =====================================================
        List<IPAsset> assets = results.stream()
                .map(dto -> {
                    IPAsset asset = new IPAsset();
                    asset.setTitle(dto.getTitle());
                    asset.setAssetType(dto.getAssetType());
                    asset.setApplicationNumber(dto.getApplicationNumber());
                    asset.setStatus(dto.getStatus());
                    asset.setCountry(dto.getCountry());
                    asset.setOwnerName(dto.getOwnerName());
                    asset.setInventorName(dto.getInventorName());
                    asset.setReferenceSource(dto.getReferenceSource());

                    // ✅ DATES
                    if (dto.getFilingDate() != null) {
                        asset.setFilingDate(LocalDate.parse(dto.getFilingDate()));
                    }

                    if (dto.getPublicationDate() != null) {
                        asset.setPublicationDate(LocalDate.parse(dto.getPublicationDate()));
                    }
                    if (dto.getPriorityDate() != null) {
                        asset.setPriorityDate(LocalDate.parse(dto.getPriorityDate()));
                    }

                    if (dto.getGrantDate() != null) {
                        asset.setGrantDate(LocalDate.parse(dto.getGrantDate()));
                    }

                    asset.setPatentLink(dto.getPatentLink());
                    asset.setPdfLink(dto.getPdfLink());
                    asset.setThumbnail(dto.getThumbnail());

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
        return results;
    }
}

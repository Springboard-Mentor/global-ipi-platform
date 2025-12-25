package com.example.demo.ip.service;

import java.util.List;

import lombok.RequiredArgsConstructor;
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
        // dto.setReferenceSource(dto.getReferenceSource());
        return dto;
    }

    public List<IPSearchResultDTO> search(IPSearchRequest request) {

        // 🔒 Basic validation
        if (request == null || request.getQuery() == null || request.getQuery().isBlank()) {
            return List.of();
        }

        String query = request.getQuery().trim();

        // 🔹 Normalize source
        String source = request.getSource() == null ? "LOCAL" : request.getSource().trim();

        // =====================================================
        // 1️⃣ LOCAL DATABASE SEARCH
        // =====================================================
        if ("LOCAL".equalsIgnoreCase(source)) {

            Page<IPAsset> cachedAssets = repository.findByTitleContainingIgnoreCase(
                    query,
                    PageRequest.of(0, PAGE_SIZE));

            if (!cachedAssets.hasContent()) {
                return List.of();
            }

            return cachedAssets.getContent().stream()
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
        List<IPSearchResultDTO> results = externalPatentClient.searchPatents(query, PAGE_SIZE);

        if (results == null || results.isEmpty()) {
            // fallback to local DB
            return repository.findByTitleContainingIgnoreCase(
                    query,
                    PageRequest.of(0, PAGE_SIZE)).getContent().stream()
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

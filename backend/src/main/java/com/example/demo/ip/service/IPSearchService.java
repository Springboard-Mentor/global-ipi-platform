package com.example.demo.ip.service;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.example.demo.ip.client.PatentViewClient;
import com.example.demo.ip.dto.IPSearchRequest;
import com.example.demo.ip.dto.IPSearchResultDTO;
import com.example.demo.ip.entity.IPAsset;
import com.example.demo.ip.mapper.IPAssetMapper;
import com.example.demo.ip.repository.IPAssetRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class IPSearchService {

    private static final int PAGE_SIZE = 20;

    private final PatentViewClient patentClient;
    private final IPAssetRepository repository;
    private final IPAssetMapper mapper;

    public List<IPSearchResultDTO> search(IPSearchRequest request) {

        if (request == null || request.getQuery() == null || request.getQuery().isBlank()) {
            return List.of();
        }

        String query = request.getQuery();

        // 1️⃣ Check DB first
        Page<IPAsset> cachedAssets =
                repository.findByTitleContainingIgnoreCase(
                        query,
                        PageRequest.of(0, PAGE_SIZE)
                );

        if (cachedAssets.hasContent()) {
            return cachedAssets.getContent().stream()
                    .map(mapper::toDto)   // ✅ FIXED
                    .map(assetDto -> {
                        IPSearchResultDTO dto = new IPSearchResultDTO();
                        dto.setId(assetDto.getId());
                        dto.setTitle(assetDto.getTitle());
                        dto.setCountry(assetDto.getCountry());
                        dto.setStatus(assetDto.getStatus());
                        dto.setAssetType(assetDto.getAssetType());
                        return dto;
                    })
                    .toList();
        }

        // 2️⃣ Call external API (already returns IPSearchResultDTO)
        List<IPSearchResultDTO> results =
                patentClient.searchPatents(query, PAGE_SIZE);

        if (results == null || results.isEmpty()) {
            return List.of();
        }

        // 3️⃣ Map DTO → Entity
        List<IPAsset> assets = results.stream()
                .map(mapper::toEntity)   // ✅ FIXED
                .toList();

        // 4️⃣ Save
        repository.saveAll(assets);

        // 5️⃣ Return API results
        return results;
    }
}

package com.example.demo.ip.service;

import com.example.demo.ip.dto.IPAssetDTO;
import com.example.demo.ip.entity.IPAsset;
import com.example.demo.ip.exception.IPAssetNotFoundException;
import com.example.demo.ip.mapper.IPAssetMapper;
import com.example.demo.ip.repository.IPAssetRepository;

import lombok.RequiredArgsConstructor;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IPAssetService {

    private final IPAssetRepository repository;
    private final IPAssetMapper mapper;

    /**
     * Get all IP assets (DTO-safe)
     */
    public List<IPAssetDTO> getAllAssets() {
        return repository.findAll()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    /**
     * Search IP assets by title (paginated)
     */
    public Page<IPAssetDTO> search(String keyword, Pageable pageable) {
        return repository
                .findByTitleContainingIgnoreCase(keyword, pageable)
                .map(mapper::toDto);
    }

    /**
     * Get IP asset by ID
     */
    public IPAssetDTO getById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new IPAssetNotFoundException("IP Asset not found with id: " + id));
    }

    /**
     * Create a new IP asset
     */
    @Transactional
    public IPAssetDTO create(IPAssetDTO dto) {
        IPAsset entity = mapper.toEntity(dto);
        IPAsset saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    /**
     * Update an existing IP asset
     */
    @Transactional
    public IPAssetDTO update(Long id, IPAssetDTO dto) {
        IPAsset existing = repository.findById(id)
                .orElseThrow(() -> new IPAssetNotFoundException("IP Asset not found with id: " + id));

        mapper.updateFromDto(dto, existing);
        return mapper.toDto(repository.save(existing));
    }

    /**
     * Delete IP asset by ID
     */
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IPAssetNotFoundException("IP Asset not found with id: " + id);
        }
        repository.deleteById(id);
    }

    /**
     * Legal Status Summary (Dashboard – OPTIMIZED)
     * Uses same derivation logic as mapper to ensure consistency
     */
    public Map<String, Long> getStatusSummary() {
        Map<String, Long> result = new LinkedHashMap<>();
        
        // Get all assets and derive status for each (consistent with mapper logic)
        List<IPAsset> allAssets = repository.findAll();
        
        for (IPAsset asset : allAssets) {
            String status = deriveLegalStatus(asset);
            result.put(status, result.getOrDefault(status, 0L) + 1);
        }
        
        return result;
    }

    /**
     * Derive legal status from entity (same logic as IPAssetMapper)
     * This ensures consistency between summary and individual asset displays
     */
    private String deriveLegalStatus(IPAsset entity) {
        // Use existing status if present and not null/empty
        if (entity.getLegalStatus() != null && !entity.getLegalStatus().trim().isEmpty()) {
            return entity.getLegalStatus();
        }

        // Otherwise derive from dates:
        // 1. Granted if grant date exists
        if (entity.getGrantDate() != null) {
            return "GRANTED";
        }

        // 2. Under examination if published but not granted
        if (entity.getPublicationDate() != null) {
            return "UNDER_EXAMINATION";
        }

        // 3. Filed if only filing date exists
        if (entity.getFilingDate() != null) {
            return "FILED";
        }

        // 4. Fallback
        return "PENDING_REVIEW";
    }
}

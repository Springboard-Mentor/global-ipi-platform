package com.example.demo.ip.service;

import com.example.demo.ip.dto.IPAssetDTO;
import com.example.demo.ip.entity.IPAsset;
import com.example.demo.ip.exception.IPAssetNotFoundException;
import com.example.demo.ip.mapper.IPAssetMapper;
import com.example.demo.ip.repository.IPAssetRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
     */
    public Map<String, Long> getStatusSummary() {
    return repository.countByLegalStatus()
            .stream()
            .collect(Collectors.toMap(
                row -> (String) row[0],
                row -> (Long) row[1]
            ));
}
}

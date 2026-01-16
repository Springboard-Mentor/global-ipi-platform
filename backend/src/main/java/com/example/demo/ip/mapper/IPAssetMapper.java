package com.example.demo.ip.mapper;

import com.example.demo.ip.dto.IPAssetDTO;
import com.example.demo.ip.dto.IPSearchResultDTO;
import com.example.demo.ip.entity.IPAsset;

import java.time.LocalDate;

import org.springframework.stereotype.Component;

@Component
public class IPAssetMapper {

    // =========================
    // ENTITY → DTO
    // =========================
    public IPAssetDTO toDto(IPAsset entity) {
        if (entity == null) {
            return null;
        }

        IPAssetDTO dto = new IPAssetDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setApplicationNumber(entity.getApplicationNumber());
        dto.setCountry(entity.getCountry());
        dto.setAssetType(entity.getAssetType());
        dto.setOwnerName(entity.getOwnerName());
        dto.setInventorName(entity.getInventorName());
        dto.setFilingDate(entity.getFilingDate());
        dto.setPublicationDate(entity.getPublicationDate());
        dto.setPriorityDate(entity.getPriorityDate());
        dto.setGrantDate(entity.getGrantDate());
        dto.setUpdatedOn(entity.getUpdatedOn());
        dto.setAbstractText(entity.getAbstractText());
        dto.setReferenceSource(entity.getReferenceSource());
        dto.setPatentLink(entity.getPatentLink());
        dto.setPdfLink(entity.getPdfLink());
        dto.setThumbnail(entity.getThumbnail());
        dto.setLegalStatus(deriveLegalStatus(entity));
        return dto;
    }

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

    // =========================
    // DTO → ENTITY (CREATE)
    // =========================
    public IPAsset toEntity(IPAssetDTO dto) {
        if (dto == null) {
            return null;
        }

        IPAsset entity = new IPAsset();
        entity.setTitle(dto.getTitle());
        entity.setApplicationNumber(dto.getApplicationNumber());
        entity.setCountry(dto.getCountry());
        entity.setLegalStatus(dto.getLegalStatus());
        entity.setAssetType(dto.getAssetType());
        entity.setOwnerName(dto.getOwnerName());
        entity.setInventorName(dto.getInventorName());
        entity.setFilingDate(dto.getFilingDate());
        entity.setPublicationDate(dto.getPublicationDate());
        entity.setPriorityDate(dto.getPriorityDate());
        entity.setGrantDate(dto.getGrantDate());
        entity.setAbstractText(dto.getAbstractText());
        entity.setReferenceSource(dto.getReferenceSource());
        entity.setPatentLink(dto.getPatentLink());
        entity.setPdfLink(dto.getPdfLink());
        entity.setThumbnail(dto.getThumbnail());

        return entity;
    }

    // =========================
    // SEARCH RESULT DTO → ENTITY
    // (External / Cached data)
    // =========================
    public IPAsset toEntity(IPSearchResultDTO dto) {
        if (dto == null) {
            return null;
        }

        IPAsset entity = new IPAsset();
        entity.setTitle(dto.getTitle());
        entity.setApplicationNumber(dto.getApplicationNumber());
        entity.setCountry(dto.getCountry());
        entity.setLegalStatus(dto.getLegalStatus());
        entity.setAssetType(dto.getAssetType());
        entity.setOwnerName(dto.getOwnerName());
        entity.setInventorName(dto.getInventorName());

        if (dto.getFilingDate() != null && !dto.getFilingDate().isBlank()) {
            entity.setFilingDate(LocalDate.parse(dto.getFilingDate()));
        }

        if (dto.getPublicationDate() != null && !dto.getPublicationDate().isBlank()) {
            entity.setPublicationDate(LocalDate.parse(dto.getPublicationDate()));
        }

        return entity;
    }

    // =========================
    // UPDATE EXISTING ENTITY
    // =========================
    public void updateFromDto(IPAssetDTO dto, IPAsset entity) {
        if (dto == null || entity == null) {
            return;
        }

        entity.setTitle(dto.getTitle());
        entity.setApplicationNumber(dto.getApplicationNumber());
        entity.setCountry(dto.getCountry());
        entity.setLegalStatus(dto.getLegalStatus());
        entity.setAssetType(dto.getAssetType());
        entity.setOwnerName(dto.getOwnerName());
        entity.setInventorName(dto.getInventorName());

        if (dto.getFilingDate() != null) {
            entity.setFilingDate(dto.getFilingDate());
        }

        if (dto.getPublicationDate() != null) {
            entity.setPublicationDate(dto.getPublicationDate());
        }
    }
}

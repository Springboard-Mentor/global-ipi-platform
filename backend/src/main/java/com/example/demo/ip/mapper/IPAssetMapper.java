package com.example.demo.ip.mapper;

import com.example.demo.ip.dto.IPAssetDTO;
import com.example.demo.ip.dto.IPSearchResultDTO;
import com.example.demo.ip.entity.IPAsset;

import java.time.LocalDate;

import org.springframework.stereotype.Component;

@Component
public class IPAssetMapper {

    // ENTITY → DTO (CRUD)

    public IPAssetDTO toDto(IPAsset entity) {
        if (entity == null)
            return null;

        IPAssetDTO dto = new IPAssetDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setApplicationNumber(entity.getApplicationNumber());
        dto.setCountry(entity.getCountry());
        dto.setStatus(entity.getStatus());
        dto.setAssetType(entity.getAssetType());
        dto.setOwnerName(entity.getOwnerName());
        dto.setInventorName(entity.getInventorName());
        dto.setFilingDate(entity.getFilingDate());
        return dto;
    }

    // DTO → ENTITY (CRUD)

    public IPAsset toEntity(IPAssetDTO dto) {
        if (dto == null)
            return null;

        IPAsset entity = new IPAsset();
        entity.setTitle(dto.getTitle());
        entity.setApplicationNumber(dto.getApplicationNumber());
        entity.setCountry(dto.getCountry());
        entity.setStatus(dto.getStatus());
        entity.setAssetType(dto.getAssetType());
        entity.setOwnerName(dto.getOwnerName());
        entity.setInventorName(dto.getInventorName());
        entity.setFilingDate(dto.getFilingDate());
        return entity;
    }

    // SEARCH DTO → ENTITY

    public IPAsset toEntity(IPSearchResultDTO dto) {
        if (dto == null)
            return null;

        IPAsset entity = new IPAsset();
        entity.setTitle(dto.getTitle());
        entity.setApplicationNumber(dto.getApplicationNumber());
        entity.setCountry(dto.getCountry());
        entity.setStatus(dto.getStatus());
        entity.setAssetType(dto.getAssetType());
        entity.setOwnerName(dto.getOwnerName());
        entity.setInventorName(dto.getInventorName());
        if (dto.getFilingDate() != null && !dto.getFilingDate().isBlank()) {
            entity.setFilingDate(LocalDate.parse(dto.getFilingDate()));
        }
        return entity;
    }

    // UPDATE EXISTING ENTITY
    public void updateFromDto(IPAssetDTO dto, IPAsset entity) {
        if (dto == null || entity == null)
            return;

        entity.setTitle(dto.getTitle());
        entity.setApplicationNumber(dto.getApplicationNumber());
        entity.setCountry(dto.getCountry());
        entity.setStatus(dto.getStatus());
        entity.setAssetType(dto.getAssetType());
        entity.setOwnerName(dto.getOwnerName());
        entity.setInventorName(dto.getInventorName());
        entity.setFilingDate(dto.getFilingDate());
    }
}

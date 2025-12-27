package com.example.demo.ip.repository;

import com.example.demo.ip.entity.IPAsset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPAssetRepository extends JpaRepository<IPAsset, Long> {

    Page<IPAsset> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

     List<IPAsset> findByTitleContainingIgnoreCase(String keyword);
     List<IPAsset> findByTitleContainingIgnoreCaseOrApplicationNumberContainingIgnoreCase(
        String title,
        String applicationNumber
);

    
    Page<IPAsset> findByTitleContainingIgnoreCaseOrApplicationNumberContainingIgnoreCase(
        String title, String applicationNumber, Pageable pageable);
        
    Page<IPAsset> findByOwnerNameContainingIgnoreCase(String owner, Pageable pageable);
    
    Page<IPAsset> findByCountryAndAssetType(String country, String assetType, Pageable pageable);
    
    boolean existsByApplicationNumber(String applicationNumber);
}
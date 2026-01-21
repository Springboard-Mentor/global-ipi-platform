package com.example.demo.ip.repository;

import com.example.demo.ip.entity.IPAsset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IPAssetRepository extends JpaRepository<IPAsset, Long> {

        @Query("""
                            SELECT i.legalStatus, COUNT(i)
                            FROM IPAsset i
                            WHERE i.legalStatus IS NOT NULL
                            GROUP BY i.legalStatus
                        """)
        List<Object[]> countByLegalStatus();

        Page<IPAsset> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);

        List<IPAsset> findByTitleContainingIgnoreCase(String keyword);

        List<IPAsset> findByTitleContainingIgnoreCaseOrApplicationNumberContainingIgnoreCase(
                        String title,
                        String applicationNumber);

        List<IPAsset> findByLegalStatus(String legalStatus);

        Page<IPAsset> findByTitleContainingIgnoreCaseOrApplicationNumberContainingIgnoreCase(
                        String title, String applicationNumber, Pageable pageable);

        Page<IPAsset> findByOwnerNameContainingIgnoreCase(String owner, Pageable pageable);

        Page<IPAsset> findByCountryAndAssetType(String country, String assetType, Pageable pageable);

        boolean existsByApplicationNumber(String applicationNumber);
        
        Optional<IPAsset> findByApplicationNumber(String applicationNumber);

        @Query("SELECT i.country, COUNT(i) FROM IPAsset i GROUP BY i.country")
        List<Object[]> countByJurisdiction();
}
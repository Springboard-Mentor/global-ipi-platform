package com.example.demo.ip.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.ip.entity.Filing;

import java.util.List;

@Repository
public interface FilingRepository extends JpaRepository<Filing, Long> {
    List<Filing> findByIpAssetId(Long assetId);
    @Query("""
    SELECT f.eventDate, COUNT(f)
    FROM Filing f
    WHERE f.eventType = 'Filed'
    GROUP BY f.eventDate
    ORDER BY f.eventDate
""")
List<Object[]> filingTrend();

}
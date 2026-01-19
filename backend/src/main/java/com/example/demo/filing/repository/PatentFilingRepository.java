package com.example.demo.filing.repository;

import com.example.demo.filing.entity.PatentFiling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatentFilingRepository extends JpaRepository<PatentFiling, Long> {
    
    List<PatentFiling> findByUserId(Long userId);
    
    Optional<PatentFiling> findByIdAndUserId(Long id, Long userId);
    
    List<PatentFiling> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<PatentFiling> findByStatus(String status);

    @org.springframework.data.jpa.repository.Query("SELECT p.status, COUNT(p) FROM PatentFiling p GROUP BY p.status")
    List<Object[]> countByStatus();

    @org.springframework.data.jpa.repository.Query("SELECT p.technicalField, COUNT(p) FROM PatentFiling p GROUP BY p.technicalField")
    List<Object[]> countByTechnicalField();

    @org.springframework.data.jpa.repository.Query("SELECT p.jurisdiction, COUNT(p) FROM PatentFiling p GROUP BY p.jurisdiction")
    List<Object[]> countByJurisdiction();

    long countByCreatedAtAfter(java.time.Instant date);
}

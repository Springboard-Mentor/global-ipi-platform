package com.example.backend.repository;

import com.example.backend.model.PatentFiling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PatentFilingRepository extends JpaRepository<PatentFiling, Long> {
    
    // Find all patent filings by user ID
    List<PatentFiling> findByUserId(String userId);
    
    // Find by status
    List<PatentFiling> findByStatus(String status);
    
    // Find by user ID and status
    List<PatentFiling> findByUserIdAndStatus(String userId, String status);
    
    // Find by payment status
    List<PatentFiling> findByPaymentStatus(String paymentStatus);
    
    // Find granted or rejected patents (case-insensitive)
    @Query("SELECT p FROM PatentFiling p WHERE LOWER(p.status) IN ('granted', 'rejected')")
    List<PatentFiling> findGrantedOrRejectedPatents();
    
    // Count patents by state
    @Query("SELECT p.applicantState, COUNT(p) FROM PatentFiling p GROUP BY p.applicantState")
    List<Object[]> countPatentsByState();
    
    // Get distinct cities by state (case-insensitive, excluding nulls and empty strings)
    @Query("SELECT DISTINCT p.applicantCity FROM PatentFiling p WHERE LOWER(p.applicantState) = LOWER(:state) AND p.applicantCity IS NOT NULL AND p.applicantCity != '' ORDER BY p.applicantCity")
    List<String> findDistinctCitiesByState(@org.springframework.data.repository.query.Param("state") String state);
}

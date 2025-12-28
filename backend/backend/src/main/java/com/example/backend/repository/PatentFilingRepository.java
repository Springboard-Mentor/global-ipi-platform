package com.example.backend.repository;

import com.example.backend.model.PatentFiling;
import org.springframework.data.jpa.repository.JpaRepository;
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
}

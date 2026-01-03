package com.example.backend.repository;

import com.example.backend.model.Patent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatentRepository extends JpaRepository<Patent, Long> {
    Optional<Patent> findById(String id);
    List<Patent> findByTitleContainingIgnoreCase(String title);
    List<Patent> findByAssigneeContainingIgnoreCase(String assignee);
    List<Patent> findByInventorContainingIgnoreCase(String inventor);
    
    @Query(value = "SELECT SUBSTRING(filing_date, 1, 4) as year, COUNT(*) as count " +
                   "FROM patents " +
                   "WHERE filing_date ~ '^[0-9]{4}' " +
                   "GROUP BY SUBSTRING(filing_date, 1, 4) " +
                   "ORDER BY year DESC", 
           nativeQuery = true)
    List<Object[]> getYearlyPatentCounts();
}

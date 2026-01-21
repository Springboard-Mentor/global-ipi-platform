package com.example.demo.filing.repository;

import com.example.demo.filing.entity.PatentFiling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatentFilingRepository extends JpaRepository<PatentFiling, Long> {
    
    List<PatentFiling> findByUserId(Long userId);

    void deleteByUserId(Long userId);
    
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

    @org.springframework.data.jpa.repository.Query(nativeQuery = true, 
        value = "SELECT TO_CHAR(created_at, 'Mon YYYY') as month, COUNT(*) as count, " +
                "SUM(CASE WHEN status = 'GRANTED' THEN 1 ELSE 0 END) as grants " +
                "FROM patent_filings " +
                "WHERE created_at > NOW() - INTERVAL '12 months' " +
                "GROUP BY TO_CHAR(created_at, 'Mon YYYY'), date_trunc('month', created_at) " +
                "ORDER BY date_trunc('month', created_at)")
    List<Object[]> countByMonthNative();

    @org.springframework.data.jpa.repository.Query(nativeQuery = true, 
        value = "SELECT TO_CHAR(created_at, 'Mon YYYY') as lbl, COUNT(*) as count, " +
                "SUM(CASE WHEN status = 'GRANTED' THEN 1 ELSE 0 END) as grants " +
                "FROM patent_filings " +
                "WHERE created_at >= :startDate " +
                "GROUP BY TO_CHAR(created_at, 'Mon YYYY'), date_trunc('month', created_at) " +
                "ORDER BY date_trunc('month', created_at)")
    List<Object[]> countByMonthRangeNativeAll(@Param("startDate") java.sql.Timestamp startDate);

    @org.springframework.data.jpa.repository.Query(nativeQuery = true, 
        value = "SELECT TO_CHAR(created_at, 'Mon YYYY') as lbl, COUNT(*) as count, " +
                "SUM(CASE WHEN status = 'GRANTED' THEN 1 ELSE 0 END) as grants " +
                "FROM patent_filings " +
                "WHERE created_at >= :startDate " +
                "AND technical_field = :category " +
                "GROUP BY TO_CHAR(created_at, 'Mon YYYY'), date_trunc('month', created_at) " +
                "ORDER BY date_trunc('month', created_at)")
    List<Object[]> countByMonthRangeNativeCategory(@Param("startDate") java.sql.Timestamp startDate, 
                                          @Param("category") String category);

    @org.springframework.data.jpa.repository.Query(nativeQuery = true, 
        value = "SELECT TO_CHAR(created_at, 'Mon DD') as lbl, COUNT(*) as count, " +
                "SUM(CASE WHEN status = 'GRANTED' THEN 1 ELSE 0 END) as grants " +
                "FROM patent_filings " +
                "WHERE created_at >= :startDate " +
                "GROUP BY TO_CHAR(created_at, 'Mon DD'), date_trunc('day', created_at) " +
                "ORDER BY date_trunc('day', created_at)")
    List<Object[]> countByDateRangeNativeAll(@Param("startDate") java.sql.Timestamp startDate);

    @org.springframework.data.jpa.repository.Query(nativeQuery = true, 
        value = "SELECT TO_CHAR(created_at, 'Mon DD') as lbl, COUNT(*) as count, " +
                "SUM(CASE WHEN status = 'GRANTED' THEN 1 ELSE 0 END) as grants " +
                "FROM patent_filings " +
                "WHERE created_at >= :startDate " +
                "AND technical_field = :category " +
                "GROUP BY TO_CHAR(created_at, 'Mon DD'), date_trunc('day', created_at) " +
                "ORDER BY date_trunc('day', created_at)")
    List<Object[]> countByDateRangeNativeCategory(@Param("startDate") java.sql.Timestamp startDate, 
                                         @Param("category") String category);


    @org.springframework.data.jpa.repository.Query(nativeQuery = true,
        value = "SELECT technical_field, AVG(grant_date - filing_date) as avg_days " +
                "FROM patent_filings " +
                "WHERE status = 'GRANTED' AND grant_date IS NOT NULL AND filing_date IS NOT NULL " +
                "GROUP BY technical_field")
    List<Object[]> getAverageProcessingTimePerField();
}

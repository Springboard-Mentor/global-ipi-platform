package com.project.backend.repository;

import com.project.backend.entity.IPAsset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPAssetRepository extends JpaRepository<IPAsset, Integer> {

    // ===========================
    // 🔐 BASIC CHECKS
    // ===========================
    boolean existsByAssetNumber(String assetNumber);

    // ===========================
    // 🔍 SIMPLE SEARCH METHODS
    // ===========================
    List<IPAsset> findByTitleContainingIgnoreCase(String keyword);

    List<IPAsset> findByType(String type);

    List<IPAsset> findByTitleContainingIgnoreCaseOrDetailsContainingIgnoreCase(
            String title,
            String details
    );

    List<IPAsset> findByTypeAndTitleContainingIgnoreCaseOrDetailsContainingIgnoreCase(
            String type,
            String title,
            String details
    );

    // ===========================
    // 🔎 CUSTOM KEYWORD SEARCH
    // ===========================
    @Query("""
        SELECT i FROM IPAsset i
        WHERE LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(i.details) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    List<IPAsset> searchByKeyword(@Param("keyword") String keyword);

    // ===========================
    // 📄 MAIN PAGINATED SEARCH
    // ===========================
    @Query("""
        SELECT i FROM IPAsset i
        WHERE (:keyword IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:type = 'ALL' OR i.type = :type)
          AND (:source = 'all' OR i.apiSource = :source)
    """)
    Page<IPAsset> searchAssets(
            @Param("keyword") String keyword,
            @Param("type") String type,
            @Param("source") String source,
            Pageable pageable
    );

    // ===========================
    // 🧠 ADVANCED SEARCH
    // ===========================
    @Query("""
        SELECT i FROM IPAsset i
        WHERE (:keyword IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:assignee IS NULL OR LOWER(i.assignee) LIKE LOWER(CONCAT('%', :assignee, '%')))
          AND (:inventor IS NULL OR LOWER(i.inventor) LIKE LOWER(CONCAT('%', :inventor, '%')))
          AND (:jurisdiction IS NULL OR LOWER(i.jurisdiction) = LOWER(:jurisdiction))
    """)
    List<IPAsset> advancedSearch(
            @Param("keyword") String keyword,
            @Param("assignee") String assignee,
            @Param("inventor") String inventor,
            @Param("jurisdiction") String jurisdiction
    );

    // ===========================
    // 🌍 MAP / ANALYTICS SUPPORT
    // ===========================
    @Query("""
        SELECT a.jurisdiction, COUNT(a)
        FROM IPAsset a
        WHERE (:keyword IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
        GROUP BY a.jurisdiction
    """)
    List<Object[]> getJurisdictionCounts(@Param("keyword") String keyword);
}

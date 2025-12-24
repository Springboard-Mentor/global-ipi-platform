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

    // ✅ REQUIRED for duplicate checking in Service
    boolean existsByAssetNumber(String assetNumber);

    // ✅ The Main Search Method
    // Logic: If source is 'local', it returns everything in the DB.
    // If source is 'api', it only returns records previously marked as 'api'.
    @Query("SELECT i FROM IPAsset i WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "  LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "  LOWER(i.assetNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "  LOWER(i.assignee) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "  LOWER(i.inventor) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:type IS NULL OR :type = 'ALL' OR :type = '' OR i.type = :type) " +
           "AND (:source IS NULL OR :source = '' OR :source = 'local' OR LOWER(i.apiSource) = LOWER(:source))")
    Page<IPAsset> searchAssets(@Param("keyword") String keyword, 
                               @Param("type") String type, 
                               @Param("source") String source, 
                               Pageable pageable);

    // --- Legacy Methods ---
    @Query("""
        SELECT ip FROM IPAsset ip
        WHERE (:keyword IS NULL OR LOWER(ip.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                               OR LOWER(ip.assignee) LIKE LOWER(CONCAT('%', :keyword, '%'))
                               OR LOWER(ip.inventor) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:assignee IS NULL OR LOWER(ip.assignee) LIKE LOWER(CONCAT('%', :assignee, '%')))
          AND (:inventor IS NULL OR LOWER(ip.inventor) LIKE LOWER(CONCAT('%', :inventor, '%')))
          AND (:jurisdiction IS NULL OR LOWER(ip.jurisdiction) = LOWER(:jurisdiction))
    """)
    List<IPAsset> advancedSearch(
            @Param("keyword") String keyword,
            @Param("assignee") String assignee,
            @Param("inventor") String inventor,
            @Param("jurisdiction") String jurisdiction
    );

    @Query("SELECT ip FROM IPAsset ip WHERE LOWER(ip.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<IPAsset> searchByKeyword(@Param("keyword") String keyword);
}
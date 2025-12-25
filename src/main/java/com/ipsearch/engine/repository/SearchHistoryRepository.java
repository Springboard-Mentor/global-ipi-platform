package com.ipsearch.engine.repository;

import com.ipsearch.engine.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for SearchHistory entity.
 */
@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
}



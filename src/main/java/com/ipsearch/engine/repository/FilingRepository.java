package com.ipsearch.engine.repository;

import com.ipsearch.engine.entity.Filing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for Filing entity.
 */
@Repository
public interface FilingRepository extends JpaRepository<Filing, Long> {
}



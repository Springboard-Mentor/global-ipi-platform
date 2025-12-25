package com.ipsearch.engine.repository;

import com.ipsearch.engine.entity.IPAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for IPAsset entity.
 */
@Repository
public interface IPAssetRepository extends JpaRepository<IPAsset, Long> {
    // Custom query methods can be added later (e.g., findByAssetNumber, etc.)
}



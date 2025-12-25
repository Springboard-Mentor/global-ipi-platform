package com.ipsearch.engine.repository;

import com.ipsearch.engine.entity.IPDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for IPDocument entity.
 */
@Repository
public interface IPDocumentRepository extends JpaRepository<IPDocument, Long> {
}



package com.example.backend.repository;

import com.example.backend.model.Patent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatentRepository extends JpaRepository<Patent, Long> {
    Optional<Patent> findById(String id);
    List<Patent> findByTitleContainingIgnoreCase(String title);
    List<Patent> findByAssigneeContainingIgnoreCase(String assignee);
    List<Patent> findByInventorContainingIgnoreCase(String inventor);
}

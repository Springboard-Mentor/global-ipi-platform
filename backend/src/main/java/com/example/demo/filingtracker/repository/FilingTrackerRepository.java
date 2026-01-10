package com.example.demo.filingtracker.repository;

import com.example.demo.filingtracker.entity.FilingTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FilingTrackerRepository extends JpaRepository<FilingTracker, Long> {
    List<FilingTracker> findByUserId(Long userId);
    Optional<FilingTracker> findByUserIdAndApplicationNumber(Long userId, String applicationNumber);
}

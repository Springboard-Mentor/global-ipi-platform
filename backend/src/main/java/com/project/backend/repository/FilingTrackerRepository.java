package com.project.backend.repository;

import com.project.backend.entity.FilingTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FilingTrackerRepository extends JpaRepository<FilingTracker, Long> {
    
    // ✅ FIX: Define the missing method to resolve Java(67108964)
    Optional<FilingTracker> findByUserIdAndIpAssetId(Integer userId, Integer ipAssetId);

    // Fetches all tracked assets for the Filing Tracker page
    List<FilingTracker> findByUserIdOrderByTrackedAtDesc(Integer userId);
}
package com.project.backend.repository;

import com.project.backend.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {
    // Find all subscriptions for a specific user
    List<Subscription> findByUserId(Integer userId);
    
    // Check if a user is already subscribed to an asset
    boolean existsByUserIdAndIpAssetId(Integer userId, Integer ipAssetId);
}
package com.example.demo.subscription.repository;

import com.example.demo.subscription.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    boolean existsByUserIdAndIpAssetId(Long userId, Long ipAssetId);
    void deleteByUserIdAndIpAssetId(Long userId, Long ipAssetId);
    List<Subscription> findByUserId(Long userId);
    List<Subscription> findByIpAssetId(Long ipAssetId);
}

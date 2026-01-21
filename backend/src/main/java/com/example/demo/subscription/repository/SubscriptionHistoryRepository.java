package com.example.demo.subscription.repository;

import com.example.demo.subscription.entity.SubscriptionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionHistoryRepository extends JpaRepository<SubscriptionHistory, Long> {
    List<SubscriptionHistory> findAllByOrderByCreatedAtDesc();
    void deleteByUserId(Long userId);
}

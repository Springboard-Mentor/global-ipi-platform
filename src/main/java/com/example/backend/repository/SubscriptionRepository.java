package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.entity.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
}

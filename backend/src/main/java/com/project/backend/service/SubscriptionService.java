package com.project.backend.service;

import com.project.backend.entity.Subscription;
import com.project.backend.entity.User;
import com.project.backend.entity.IPAsset;
import com.project.backend.repository.SubscriptionRepository;
import com.project.backend.repository.UserRepository;
import com.project.backend.repository.IPAssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IPAssetRepository ipAssetRepository;

    /**
     * Logic to subscribe a user to an IP Asset
     */
    public Subscription subscribe(Integer userId, Integer ipAssetId) {
        Subscription sub = new Subscription();

        // Convert Integer userId to Long for the UserRepository
        User user = userRepository.findById(userId.longValue())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        // Use Integer ipAssetId directly for IPAssetRepository
        IPAsset asset = ipAssetRepository.findById(ipAssetId)
                .orElseThrow(() -> new RuntimeException("IP Asset not found with ID: " + ipAssetId));

        sub.setUser(user);
        sub.setIpAsset(asset);
        sub.setCreatedAt(LocalDateTime.now()); // Matches requirement

        return subscriptionRepository.save(sub);
    }

    public List<Subscription> getSubscriptions(Integer userId) {
        return subscriptionRepository.findByUserId(userId);
    }
}
package com.example.demo.subscription.repository;

import com.example.demo.subscription.entity.Subscription;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class SubscriptionRepositoryTest {

    @Autowired
    private SubscriptionRepository repository;

    @Test
    void save_and_find() {
        Subscription s = Subscription.builder().userId(1L).ipAssetId(100L).build();
        s = repository.save(s);
        assertThat(repository.existsByUserIdAndIpAssetId(1L, 100L)).isTrue();
        assertThat(repository.findByUserId(1L)).isNotEmpty();
    }
}

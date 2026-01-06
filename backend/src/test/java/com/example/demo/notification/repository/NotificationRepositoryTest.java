package com.example.demo.notification.repository;

import com.example.demo.notification.entity.Notification;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class NotificationRepositoryTest {

    @Autowired
    private NotificationRepository repository;

    @Test
    void save_and_query_page() {
        Notification n = Notification.builder().userId(1L).message("Hello").build();
        n = repository.save(n);
        var page = repository.findByUserIdOrderByTimestampDesc(1L, PageRequest.of(0, 10));
        assertThat(page.getTotalElements()).isGreaterThanOrEqualTo(1);
    }
}

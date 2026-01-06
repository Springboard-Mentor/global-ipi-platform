package com.example.demo.integration;

import com.example.demo.notification.repository.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class NotificationControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private NotificationRepository notificationRepository;

    private final RestTemplate rest = new RestTemplate();

    private String base() { return "http://localhost:" + port; }

    @Test
    void broadcast_creates_notifications_for_subscribers() throws Exception {
        String email1 = "int+u1@example.com";
        String email2 = "int+u2@example.com";

        // Register users
        rest.postForEntity(base() + "/auth/register", Map.of("name", "User1", "email", email1, "password", "Password123!"), Map.class);
        rest.postForEntity(base() + "/auth/register", Map.of("name", "User2", "email", email2, "password", "Password123!"), Map.class);

        // Login user1 and user2 and create subscriptions
        var login1 = rest.postForEntity(base() + "/auth/login", Map.of("email", email1, "password", "Password123!"), Map.class);
        String t1 = (String)((Map)login1.getBody()).get("token");
        HttpHeaders h1 = new HttpHeaders(); h1.setBearerAuth(t1); h1.setContentType(MediaType.APPLICATION_JSON);
        rest.exchange(base() + "/api/subscriptions", HttpMethod.POST, new HttpEntity<>(Map.of("ipAssetId", 777), h1), Map.class);

        var login2 = rest.postForEntity(base() + "/auth/login", Map.of("email", email2, "password", "Password123!"), Map.class);
        String t2 = (String)((Map)login2.getBody()).get("token");
        HttpHeaders h2 = new HttpHeaders(); h2.setBearerAuth(t2); h2.setContentType(MediaType.APPLICATION_JSON);
        rest.exchange(base() + "/api/subscriptions", HttpMethod.POST, new HttpEntity<>(Map.of("ipAssetId", 777), h2), Map.class);

        // Broadcast (call as user1)
        var broadcastResp = rest.exchange(base() + "/api/notifications/broadcast", HttpMethod.POST, new HttpEntity<>(Map.of("ipAssetId", 777, "message", "Update!"), h1), Map.class);
        assertThat(broadcastResp.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Verify notifications increased by >=2
        Thread.sleep(200);
        long total = notificationRepository.count();
        assertThat(total).isGreaterThanOrEqualTo(2);
    }
}

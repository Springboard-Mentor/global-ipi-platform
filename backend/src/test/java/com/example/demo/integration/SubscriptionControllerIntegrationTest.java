package com.example.demo.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class SubscriptionControllerIntegrationTest {

    @LocalServerPort
    private int port;

    private final RestTemplate rest = new RestTemplate();

    private String base() { return "http://localhost:" + port; }

    @Test
    void register_login_subscribe_list_flow() {
        String email = "int+sub@example.com";
        // Register
        var reg = Map.of("name", "Int Tester", "email", email, "password", "Password123!");
        rest.postForEntity(base() + "/auth/register", reg, Map.class);

        // Login
        var login = rest.postForEntity(base() + "/auth/login", Map.of("email", email, "password", "Password123!"), Map.class);
        assertThat(login.getStatusCode()).isEqualTo(HttpStatus.OK);
        String token = (String)((Map)login.getBody()).get("token");
        assertThat(token).isNotBlank();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create subscription
        var create = new HttpEntity<>(Map.of("ipAssetId", 555), headers);
        var resp = rest.exchange(base() + "/api/subscriptions", HttpMethod.POST, create, Map.class);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);

        // List
        var list = rest.exchange(base() + "/api/subscriptions?page=0&size=10", HttpMethod.GET, new HttpEntity<>(headers), Map.class);
        assertThat(list.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(list.getBody()).isNotNull();
    }
}

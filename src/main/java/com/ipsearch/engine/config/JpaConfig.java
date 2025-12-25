package com.ipsearch.engine.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * JPA configuration.
 * Ensures our base package is scanned for repositories.
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.ipsearch.engine.repository")
public class JpaConfig {
    // Additional JPA-related configuration can be added here in future milestones.
}



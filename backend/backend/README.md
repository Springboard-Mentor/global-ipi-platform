# Spring Boot Beginner Guide

This guide provides a step-by-step introduction to setting up and developing a Spring Boot application. We'll cover essential concepts including project setup, JPA for data persistence, Lombok for reducing boilerplate code, Spring Beans, REST contracts, and security.

## Prerequisites

- Java 17 or higher
- Maven or Gradle (we'll use Maven in this guide)
- An IDE like IntelliJ IDEA or Eclipse

## 1. Setting Up a Spring Boot Project

### Using Spring Initializr

The easiest way to create a Spring Boot project is through [Spring Initializr](https://start.spring.io/):

1. Go to https://start.spring.io/
2. Choose:
   - Project: Maven Project
   - Language: Java
   - Spring Boot: Latest stable version
3. Project Metadata:
   - Group: com.example
   - Artifact: demo
   - Name: demo
   - Description: Demo project for Spring Boot
   - Package name: com.example.demo
4. Dependencies: Add the following:
   - Spring Web
   - Spring Data JPA
   - H2 Database (for simplicity)
   - Lombok
   - Spring Security
5. Click "Generate" and download the ZIP file
6. Extract and open in your IDE

### Manual Setup with Maven

If you prefer manual setup, create a `pom.xml` file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
        <relativePath/>
    </parent>
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

## 2. Project Structure

A typical Spring Boot project structure looks like this:

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── example/
│   │           └── demo/
│   │               ├── DemoApplication.java
│   │               ├── controller/
│   │               ├── entity/
│   │               ├── repository/
│   │               ├── service/
│   │               └── config/
│   └── resources/
│       ├── application.properties
│       └── data.sql (optional)
└── test/
    └── java/
        └── com/
            └── example/
                └── demo/
                    └── DemoApplicationTests.java
```

## 3. Main Application Class

Create the main application class:

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}
```

## 4. Configuration (application.properties)

Configure your application in `src/main/resources/application.properties`:

```properties
# Server configuration
server.port=8080

# Database configuration (H2)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# JPA/Hibernate properties
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# H2 Console (for development)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Logging
logging.level.com.example.demo=DEBUG
```

## 5. Entities with JPA and Lombok

Create an entity class using JPA annotations and Lombok:

```java
package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
}
```

## 6. Repositories

Create a repository interface for data access:

```java
package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
```

## 7. Services (Spring Beans)

Create a service class as a Spring Bean:

```java
package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }
}
```

## 8. Controllers (REST Contracts)

Create REST controllers to define your API contracts:

```java
package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

## 9. Spring Security

Configure basic security:

```java
package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/api/users/**").authenticated()
                .anyRequest().permitAll()
            )
            .httpBasic()
            .and()
            .csrf().disable()
            .headers().frameOptions().disable();

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.builder()
                .username("user")
                .password(passwordEncoder().encode("password"))
                .roles("USER")
                .build();

        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder().encode("admin"))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(user, admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## 10. Running the Application

1. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```

2. Or run the main class in your IDE.

3. Access the application:
   - API endpoints: http://localhost:8080/api/users
   - H2 Console: http://localhost:8080/h2-console

4. Test the API using curl or Postman:
   ```bash
   # Get all users (requires authentication)
   curl -u user:password http://localhost:8080/api/users

   # Create a user
   curl -u user:password -X POST -H "Content-Type: application/json" \
        -d '{"name":"John Doe","email":"john@example.com","password":"secret"}' \
        http://localhost:8080/api/users
   ```

## Additional Essential Concepts

### Dependency Injection

Spring Boot uses dependency injection extensively. Notice how we inject `UserRepository` into `UserService` and `UserService` into `UserController` using constructor injection with `@RequiredArgsConstructor` from Lombok.

### Bean Scopes

By default, Spring beans are singletons. You can change this with `@Scope` annotation:

```java
@Service
@Scope("prototype")
public class MyService {
    // This creates a new instance each time it's injected
}
```

### Profiles

Use profiles for different environments:

```properties
# application-dev.properties
spring.profiles.active=dev
database.url=jdbc:mysql://localhost:3306/myapp_dev

# application-prod.properties
spring.profiles.active=prod
database.url=jdbc:mysql://prod-server:3306/myapp_prod
```

### Validation

Add validation to your entities and controllers:

```java
import jakarta.validation.constraints.*;

@Entity
@Data
public class User {
    // ...

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
}
```

```java
@PostMapping
public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
    // The @Valid annotation triggers validation
}
```

### Exception Handling

Create a global exception handler:

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.internalServerError().body("Internal server error");
    }
}
```

## Next Steps

- Explore Spring Boot Actuator for monitoring
- Learn about Spring Boot Testing
- Implement JWT authentication for more advanced security
- Use Spring Data REST for automatic REST endpoints
- Integrate with external services

This guide covers the basics to get you started with Spring Boot.

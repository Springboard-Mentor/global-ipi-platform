package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "users")
@Getter
@Setter
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
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;

    private String phone;

    private String countryCode;

    @Column(nullable = false)
    private String role;

    private String status;

    private String subscription;

    private Instant createdAt;

    private Instant disabledAt;

    @PrePersist
    public void prePersist() {
        if (role == null) role = "USER";
        if (status == null) status = "Active";
        if (subscription == null) subscription = "Free";
        if (createdAt == null) createdAt = Instant.now();
    }
}

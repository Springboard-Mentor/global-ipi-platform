package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // This is the line you were missing:
    boolean existsByEmail(String email);

    // This is often useful too, so I included it just in case:
    Optional<User> findByEmail(String email);
}
package com.example.demo.service.impl;

import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    // -----------------------------
    // REGISTER
    // -----------------------------
    @Override
    public String register(RegisterRequest request) {

        if (repo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setCreatedAt(Instant.now());

        repo.save(user);
        return "User registered successfully!";
    }

    // -----------------------------
    // CRUD OPERATIONS
    // -----------------------------
    @Override
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return repo.findById(id);
    }

    @Override
    public User createUser(User user) {
        if (repo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(Instant.now());
        return repo.save(user);
    }

    @Override
    public User updateUser(Long id, User details) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(details.getName());
        user.setEmail(details.getEmail());
        user.setPhone(details.getPhone());
        user.setCountryCode(details.getCountryCode());

        return repo.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        repo.delete(user);
    }

    // -----------------------------
    // PROFILE OPERATIONS
    // -----------------------------
    @Override
    public User findByEmail(String email) {
        return repo.findByEmail(email).orElse(null);
    }

    @Override
    public User updateProfile(String email, UpdateProfileRequest request) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null)
            user.setName(request.getName());

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (repo.existsByEmail(request.getEmail()))
                throw new RuntimeException("Email already in use");
            user.setEmail(request.getEmail());
        }

        if (request.getPhone() != null)
            user.setPhone(request.getPhone());

        if (request.getCountryCode() != null)
            user.setCountryCode(request.getCountryCode());

        return repo.save(user);
    }

    @Override
    public void changePassword(String email, ChangePasswordRequest request) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        repo.save(user);
    }
}

package com.project.backend.service;

import com.project.backend.entity.User;
import com.project.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }
        return userRepository.save(user);
    }
    
    /**
     * Finds a user by email, or creates a new user record for Firebase/Google login.
     * This handles the auto-registration process.
     */
    @Transactional
    public User findOrCreateFirebaseUser(String email, String name, String firebaseUid) {
        
        // 1. Check if user already exists
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            return userOptional.get();
        }
        
        // 2. If user does not exist, create a new local user account
        User newUser = new User();
        newUser.setName(name); 
        newUser.setEmail(email);
        
        // 🚨 IMPORTANT: Since the password is not provided, we must set a strong, unique placeholder.
        // The passwordEncoder hashes the Firebase UID, making it secure and unique.
        newUser.setPassword(passwordEncoder.encode(firebaseUid)); 
        
        // 🔧 FIXED: Changed from "USER" to "Individual" to match your existing system
        newUser.setUserType("Individual"); // Default role/type for Google sign-ups
        
        return userRepository.save(newUser);
    }
}
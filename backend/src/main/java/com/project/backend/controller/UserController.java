package com.project.backend.controller;

import com.project.backend.entity.User;
import com.project.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Crucial for React connection
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser) {
        try {
            // Fixes your error: Uses getName() instead of getUsername()
            System.out.println("New registration for: " + newUser.getName());
            
            User savedUser = userService.createUser(newUser);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
package com.project.backend.controller;

import com.project.backend.entity.User;
import com.project.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Allows your frontend to talk to this backend
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. REGISTER USER (POST Request)
    // Frontend sends JSON data -> Controller accepts it -> Saves to Database
    @PostMapping("/register")
    public User registerUser(@RequestBody User newUser) {
        System.out.println("New registration for: " + newUser.getUsername());
        return userRepository.save(newUser);
    }

    // 2. GET ALL USERS (GET Request)
    // Useful for you to check if data is saved without opening pgAdmin
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
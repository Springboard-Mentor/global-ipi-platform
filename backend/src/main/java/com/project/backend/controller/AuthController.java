package com.project.backend.controller;

import com.project.backend.dto.LoginRequest;
import com.project.backend.dto.RegisterRequest;
import com.project.backend.entity.User;
import com.project.backend.repository.UserRepository;
import com.project.backend.service.UserService; // 👈 NEW: Import the Service Layer
import com.project.backend.util.JwtUtil;
import com.google.firebase.auth.FirebaseAuth; // 👈 NEW: Firebase Auth
import com.google.firebase.auth.FirebaseAuthException; // 👈 NEW: Firebase Exception
import com.google.firebase.auth.FirebaseToken; // 👈 NEW: Firebase Token
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService; // 👈 NEW: Use service for complex user logic

    // --- EXISTING LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // ... (Existing login logic is fine) ...
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isPresent() &&
            passwordEncoder.matches(loginRequest.getPassword(), userOptional.get().getPassword())) {

            String token = jwtUtil.generateToken(userOptional.get().getEmail());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", userOptional.get()
            ));
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid Email or Password"));
    }

    // --- EXISTING REGISTER ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        // ... (Existing register logic is fine) ...
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("message", "Email already registered"));
        }

        User newUser = new User();
        newUser.setName(registerRequest.getName());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setUserType(registerRequest.getUserType());

        User savedUser = userRepository.save(newUser);

        String token = jwtUtil.generateToken(savedUser.getEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", savedUser
        ));
    }


    // --- NEW: FIREBASE LOGIN / TOKEN VALIDATION ---
    // Endpoint: POST /api/auth/firebase-login
    @PostMapping("/firebase-login")
    public ResponseEntity<?> firebaseLogin(@RequestBody Map<String, String> payload) {
        String idToken = payload.get("idToken");
        
        if (idToken == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "ID Token is missing."));
        }

        try {
            // 1. Verify the Firebase token using the Admin SDK
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String email = decodedToken.getEmail();
            String name = decodedToken.getName(); // Name from Google/Firebase profile
            String firebaseUid = decodedToken.getUid();
            
            // 2. Find or create the user in the local database
            User user = userService.findOrCreateFirebaseUser(
                email, 
                name,
                firebaseUid
            );

            // 3. Generate your application's JWT for the session
            String localJwt = jwtUtil.generateToken(user.getEmail());
            
            // 4. Return the local token and user details to the frontend
            return ResponseEntity.ok(Map.of(
                "token", localJwt,
                "user", Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "userType", user.getUserType()
                )
            ));

        } catch (FirebaseAuthException e) {
            System.err.println("Firebase Token Verification Failed: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of("message", "Authentication failed: Invalid Firebase token."));
        } catch (Exception e) {
            System.err.println("Local Session Creation Failed: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("message", "Internal error during session creation."));
        }
    }
}
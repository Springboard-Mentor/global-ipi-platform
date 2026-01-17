package com.project.backend.controller;

import com.project.backend.dto.LoginRequest;
import com.project.backend.dto.RegisterRequest;
import com.project.backend.entity.User;
import com.project.backend.repository.UserRepository;
import com.project.backend.service.UserService;
import com.project.backend.util.JwtUtil;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allows mobile/web access
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    // ----------------------------------------------------------------
    // ⚙️ CONFIGURATION: CHANGE THIS TO YOUR LAPTOP IP
    // ----------------------------------------------------------------
    // Use "localhost" for laptop only.
    // Use "192.168.x.x" (your LAN IP) to test on Mobile.
    private final String FRONTEND_URL = "http://localhost:5173"; 

    // ==========================================
    // 🔐 LOGIN & REGISTER
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("🔹 Login Attempt: " + loginRequest.getEmail());
        
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isPresent()) {
            if (passwordEncoder.matches(loginRequest.getPassword(), userOptional.get().getPassword())) {
                String token = jwtUtil.generateToken(userOptional.get().getEmail());
                return ResponseEntity.ok(Map.of("token", token, "user", userOptional.get()));
            } else {
                System.out.println("❌ Password Mismatch for: " + loginRequest.getEmail());
            }
        } else {
            System.out.println("❌ User Not Found: " + loginRequest.getEmail());
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid Email or Password"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("message", "Email already registered"));
        }

        User newUser = new User();
        newUser.setName(registerRequest.getName());
        newUser.setEmail(registerRequest.getEmail());
        // ✅ Ensure password is hashed
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setUserType(registerRequest.getUserType());

        User savedUser = userRepository.save(newUser);
        String token = jwtUtil.generateToken(savedUser.getEmail());

        return ResponseEntity.ok(Map.of("token", token, "user", savedUser));
    }

    @PostMapping("/firebase-login")
    public ResponseEntity<?> firebaseLogin(@RequestBody Map<String, String> payload) {
        String idToken = payload.get("idToken");
        if (idToken == null) return ResponseEntity.badRequest().body(Map.of("message", "ID Token missing"));
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            User user = userService.findOrCreateFirebaseUser(decodedToken.getEmail(), decodedToken.getName(), decodedToken.getUid());
            String localJwt = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(Map.of("token", localJwt, "user", user));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Auth failed"));
        }
    }

    // ==========================================
    // 📧 PASSWORD RECOVERY (Mobile Compatible)
    // ==========================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String userEmail = payload.get("email"); 
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        
        if (userOpt.isEmpty()) {
            // Return OK for security, but log it internally
            System.out.println("⚠️ Forgot Password: Email not found - " + userEmail);
            return ResponseEntity.ok(Map.of("message", "If an account exists, a link has been sent."));
        }

        User user = userOpt.get();
        
        // 1. Generate Token
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user); // ✅ Critical: Save token to DB

        // 2. Create Mobile-Friendly Link
        String resetLink = FRONTEND_URL + "/login?token=" + token;

        // 3. Send Email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail); 
            message.setTo(userEmail);     
            message.setSubject("Reset Password - Action Required");
            message.setText("Hello " + user.getName() + ",\n\n" +
                    "Click here to reset your password:\n" + resetLink + "\n\n" +
                    "Link expires in 1 hour.");

            mailSender.send(message);
            System.out.println("✅ Reset link sent to: " + userEmail);
            System.out.println("🔗 Link: " + resetLink);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Failed to send email."));
        }

        return ResponseEntity.ok(Map.of("message", "Reset link sent successfully."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("password");

        System.out.println("🔹 Reset Attempt with Token: " + token);

        // 1. Find user by token
        Optional<User> userOpt = userRepository.findByResetToken(token);

        if (userOpt.isEmpty()) {
            System.out.println("❌ Invalid Token");
            return ResponseEntity.status(400).body(Map.of("message", "Invalid or expired token."));
        }

        User user = userOpt.get();

        // 2. Check Expiry
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            System.out.println("❌ Token Expired");
            return ResponseEntity.status(400).body(Map.of("message", "Link has expired."));
        }

        // 3. Update Password
        // ✅ Critical: Encode new password before saving
        user.setPassword(passwordEncoder.encode(newPassword)); 
        
        // 4. Clear Token
        user.setResetToken(null);       
        user.setResetTokenExpiry(null); 
        
        userRepository.save(user); // ✅ Commit to DB
        System.out.println("✅ Password updated successfully for: " + user.getEmail());

        return ResponseEntity.ok(Map.of("message", "Password changed successfully! Please login."));
    }
}
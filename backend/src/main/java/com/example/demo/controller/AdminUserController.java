package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // Set default password since admin adds users without one initially
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword("Default@123"); 
        }
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportUsers() {
        List<User> users = userService.getAllUsers();
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        // Header
        pw.println("ID,Name,Email,Role,Status,Subscription,Created At");

        for (User u : users) {
             pw.printf("%d,\"%s\",\"%s\",%s,%s,%s,%s%n",
                     u.getId(),
                     u.getName() != null ? u.getName().replace("\"", "\"\"") : "",
                     u.getEmail(),
                     u.getRole(),
                     u.getStatus() != null ? u.getStatus() : "",
                     u.getSubscription() != null ? u.getSubscription() : "",
                     u.getCreatedAt()
             );
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"users.csv\"")
                .header(HttpHeaders.CONTENT_TYPE, "text/csv")
                .body(sw.toString());
    }
}

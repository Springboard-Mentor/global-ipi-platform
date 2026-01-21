package com.example.demo.admin.controller;

import com.example.demo.admin.entity.AdminUISettings;
import com.example.demo.admin.service.AdminUIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/ui")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminUIManagementController {

    private final AdminUIService service;
    private final Path uploadLocation;

    public AdminUIManagementController(AdminUIService service) {
        this.service = service;
        this.uploadLocation = Paths.get("uploads");
        try {
            Files.createDirectories(uploadLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage", e);
        }
    }

    @GetMapping("/settings")
    public ResponseEntity<AdminUISettings> getSettings() {
        return ResponseEntity.ok(service.getSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<AdminUISettings> updateSettings(@RequestBody AdminUISettings settings) {
        return ResponseEntity.ok(service.updateSettings(settings));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            jakarta.servlet.http.HttpServletRequest request) {
        try {
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetPath = uploadLocation.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            
            // Build absolute URL
            String baseUrl = request.getRequestURL().toString().replace(request.getRequestURI(), "");
            String fileUrl = baseUrl + "/uploads/" + filename;
            
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }
}

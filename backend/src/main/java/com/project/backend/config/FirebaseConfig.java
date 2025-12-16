package com.project.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.util.List;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            // 1. Check if Firebase is already running (prevents errors on reload)
            List<FirebaseApp> apps = FirebaseApp.getApps();
            if (apps != null && !apps.isEmpty()) {
                return;
            }

            // 2. Load the file you just downloaded
            InputStream serviceAccount = getClass().getClassLoader().getResourceAsStream("serviceAccountKey.json");

            if (serviceAccount == null) {
                System.err.println("❌ FATAL ERROR: serviceAccountKey.json not found in src/main/resources/");
                throw new RuntimeException("serviceAccountKey.json missing");
            }

            // 3. Configure Firebase with credentials
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);
            System.out.println("✅ Firebase Initialized Successfully!");

        } catch (Exception e) {
            System.err.println("❌ Firebase Initialization Failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
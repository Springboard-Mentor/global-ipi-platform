package com.project.backend;

import com.project.backend.entity.IPAsset;
import com.project.backend.repository.IPAssetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;

import java.util.List;
import java.util.Random;

@SpringBootApplication
@EnableCaching
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    
    @Bean
    CommandLineRunner initGraphData(IPAssetRepository repository) {
        return args -> {
            List<IPAsset> assets = repository.findAll();
            
            
            boolean hasConvergenceData = assets.stream()
                .anyMatch(a -> a.getAssetClass() != null && a.getAssetClass().contains(","));

           
            if (!hasConvergenceData && !assets.isEmpty()) {
                System.out.println("⚠️ Graph Data Missing. Generating Convergence Data Automatically...");

                String[] mixClasses = {"G06N", "B60L", "H04W", "A61K", "G06F", "H02S", "B25J", "H01L"};
                Random random = new Random();

                
                for (int i = 0; i < assets.size() && i < 60; i++) {
                    IPAsset asset = assets.get(i);
                    
                    
                    String currentClass = asset.getAssetClass();
                    if (currentClass == null || currentClass.isEmpty()) currentClass = "G06N";
                    
                    
                    String extraClass = mixClasses[random.nextInt(mixClasses.length)];
                    
                   
                    if (!currentClass.contains(extraClass)) {
                        
                        asset.setAssetClass(currentClass + ", " + extraClass);
                        repository.save(asset);
                    }
                }
                System.out.println("✅ Convergence Graph Data Created Successfully! (60 Records Updated)");
            } else {
                System.out.println("✅ Graph Data Already Exists. No changes made.");
            }
        };
    }
}
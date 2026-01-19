package com.example.demo.admin.repository;

import com.example.demo.admin.entity.AdminUISettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminUISettingsRepository extends JpaRepository<AdminUISettings, Long> {
}

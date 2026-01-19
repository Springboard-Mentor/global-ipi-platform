package com.example.demo.admin.service;

import com.example.demo.admin.entity.AdminUISettings;
import com.example.demo.admin.repository.AdminUISettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminUIService {

    private final AdminUISettingsRepository repository;

    public AdminUIService(AdminUISettingsRepository repository) {
        this.repository = repository;
    }

    public AdminUISettings getSettings() {
        return repository.findAll().stream().findFirst().orElseGet(this::createDefaultSettings);
    }

    public AdminUISettings updateSettings(AdminUISettings newSettings) {
        AdminUISettings current = getSettings();
        
        // Update fields if they are provided (not null)
        if (newSettings.getActiveThemeId() != null) current.setActiveThemeId(newSettings.getActiveThemeId());
        if (newSettings.getActiveLayoutId() != null) current.setActiveLayoutId(newSettings.getActiveLayoutId());
        
        if (newSettings.getLogoUrl() != null) current.setLogoUrl(newSettings.getLogoUrl());
        if (newSettings.getFaviconUrl() != null) current.setFaviconUrl(newSettings.getFaviconUrl());
        if (newSettings.getFontFamily() != null) current.setFontFamily(newSettings.getFontFamily());
        if (newSettings.getFontSize() != null) current.setFontSize(newSettings.getFontSize());
        
        if (newSettings.getCompanyName() != null) current.setCompanyName(newSettings.getCompanyName());
        if (newSettings.getFooterText() != null) current.setFooterText(newSettings.getFooterText());
        if (newSettings.getWelcomeMessage() != null) current.setWelcomeMessage(newSettings.getWelcomeMessage());

        return repository.save(current);
    }

    private AdminUISettings createDefaultSettings() {
        AdminUISettings settings = new AdminUISettings();
        settings.setActiveThemeId("dark");
        settings.setActiveLayoutId("sidebar");
        settings.setCompanyName("Global IP Platform");
        settings.setFooterText("© 2024 Global IP Platform");
        settings.setWelcomeMessage("Welcome to your IP dashboard");
        settings.setFontFamily("Inter");
        settings.setFontSize("Medium");
        return repository.save(settings);
    }
}

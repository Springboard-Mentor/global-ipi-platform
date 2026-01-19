package com.example.demo.admin.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "admin_ui_settings")
@Data
public class AdminUISettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Theme (ID of the active theme)
    private String activeThemeId;

    // Layout (ID of the active layout)
    private String activeLayoutId;

    // Branding
    private String logoUrl;
    private String faviconUrl;
    private String fontFamily;
    private String fontSize;

    // Components
    // "Header Logo" is likely same as logoUrl, but separate for now if needed. 
    // Usually header logo comes from branding using logoUrl.
    // We'll store text fields.
    private String companyName;
    private String footerText;
    private String welcomeMessage;
}

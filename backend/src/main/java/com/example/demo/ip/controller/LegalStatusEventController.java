package com.example.demo.ip.controller;

import com.example.demo.ip.entity.LegalStatusEvent;
import com.example.demo.ip.service.LegalStatusEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ip-assets")
@RequiredArgsConstructor
public class LegalStatusEventController {

    private final LegalStatusEventService service;

    /**
     * Legal Status Timeline API
     */
    @GetMapping("/{id}/legal-status")
    public List<LegalStatusEvent> getLegalStatusTimeline(@PathVariable Long id) {
        return service.getTimeline(id);
    }
}

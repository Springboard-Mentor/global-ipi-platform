package com.example.demo.ip.repository;

import com.example.demo.ip.entity.LegalStatusEvent;
import com.example.demo.ip.entity.IPAsset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LegalStatusEventRepository
        extends JpaRepository<LegalStatusEvent, Long> {

    List<LegalStatusEvent> findByAssetOrderByEventDateAsc(IPAsset asset);
}

package com.example.demo.ip.repository;

import com.example.demo.ip.entity.IPSearch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPSearchRepository extends JpaRepository<IPSearch, Long> {

    List<IPSearch> findByKeywordContainingIgnoreCase(String keyword);

    List<IPSearch> findTop10ByOrderBySearchedAtDesc();
}

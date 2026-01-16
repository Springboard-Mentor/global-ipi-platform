package com.example.demo.filing.repository;

import com.example.demo.filing.entity.Inventor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventorRepository extends JpaRepository<Inventor, Long> {
    
    Optional<Inventor> findByName(String name);
}

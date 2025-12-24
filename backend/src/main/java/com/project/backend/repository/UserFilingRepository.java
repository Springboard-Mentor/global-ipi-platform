package com.project.backend.repository;

import com.project.backend.entity.UserFiling;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserFilingRepository extends JpaRepository<UserFiling, Long> {
}
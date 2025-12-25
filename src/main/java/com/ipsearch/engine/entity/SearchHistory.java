package com.ipsearch.engine.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * SearchHistory entity tracks what users searched for.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(of = "id")
@Entity
@Table(name = "search_history")
public class SearchHistory {

    /**
     * Primary key (auto-generated).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Keyword(s) typed by the user.
     */
    @Column(name = "keyword", length = 255)
    private String keyword;

    /**
     * Assignee filter used during search (optional).
     */
    @Column(name = "assignee", length = 255)
    private String assignee;

    /**
     * Inventor filter used during search (optional).
     */
    @Column(name = "inventor", length = 255)
    private String inventor;

    /**
     * Jurisdiction filter used during search (optional).
     */
    @Column(name = "jurisdiction", length = 50)
    private String jurisdiction;

    /**
     * Timestamp when the search was executed.
     */
    @Column(name = "searched_at", nullable = false)
    private LocalDateTime searchedAt;
}



package com.example.demo.filing.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inventors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Inventor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToMany(mappedBy = "inventors")
    private List<PatentFiling> patentFilings = new ArrayList<>();
}

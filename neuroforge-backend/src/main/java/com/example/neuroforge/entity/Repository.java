package com.example.neuroforge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Repository {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn( name = "project_id", nullable = false)
    private Project project;
    @ManyToOne
    @JoinColumn(name = "organization_id",nullable = false)
    private Organization organization;
    @Column( nullable = false)
    private String gitHubRepoId;
    @Column( nullable = false)
    private String repositoryName;
    @Column( nullable = false)
    private String url;
    @Column( nullable = false)
    private String defaultBranch;
    @Column( nullable = false)
    private LocalDate createdAt;
    @OneToMany( mappedBy = "repo")
    private List<Release> releases;
}

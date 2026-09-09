package com.example.neuroforge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table( name = "project_release")
public class Release {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn( name = "project_id", nullable = false)
    private Project project;
    @ManyToOne
    @JoinColumn( name = "sprint_id", nullable = false)
    private Sprint sprint;
    @ManyToOne
    @JoinColumn( name = "repo_id", nullable = false)
    private Repository repo;
    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    @Column( nullable = false)
    private String version;
    @Enumerated(EnumType.STRING)
    @Column( nullable = false)
    private ReleaseStatus releaseStatus;
    @Column( nullable = false)
    private LocalDate releaseDate;
    @Column( nullable = false)
    private String changelog;
    @OneToMany( mappedBy = "release")
    private List<Deployment> deployments;
}

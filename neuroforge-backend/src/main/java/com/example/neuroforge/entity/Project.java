package com.example.neuroforge.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn( name = "project_manager_id", nullable = false)
    private User projectManager;
    @ManyToOne
    @JoinColumn(name = "organization_id",nullable = false)
    private Organization organization;
    @NotBlank
    @Column( nullable = false)
    private String title;
    @NotBlank
    @Column( nullable = false)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column( nullable = false)
    private ProjectStatus projectStatus;
    @Column( nullable = false)
    private LocalDate start_date;
    @Column( nullable = false)
    private LocalDate end_date;
    @OneToMany( mappedBy = "project")
    private List<Requirement> requirements;
    @OneToMany( mappedBy = "project")
    private List<Sprint> sprints;
    @OneToMany( mappedBy = "project")
    private List<Report> reports;
    @OneToMany( mappedBy = "project")
    private List<Document> documents;
    @OneToMany( mappedBy = "project")
    private List<Repository> repositories;
    @OneToMany( mappedBy = "project")
    private List<Release> releases;

}

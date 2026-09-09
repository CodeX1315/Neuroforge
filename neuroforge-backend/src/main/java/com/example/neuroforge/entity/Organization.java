package com.example.neuroforge.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    @NotBlank
    private String organizationName;
    @Column(unique = true,nullable = false)
    private String inviteCode;

    @OneToMany(mappedBy = "organization")
    private List<User> users;
    @OneToMany(mappedBy = "organization")
    private List<Project> projects;
    @OneToMany(mappedBy = "organization")
    private List<Requirement> requirements;
    @OneToMany(mappedBy = "organization")
    private List<Sprint> sprints;
    @OneToMany(mappedBy = "organization")
    private List<Report> reports;
    @OneToMany(mappedBy = "organization")
    private List<Document> documents;
    @OneToMany(mappedBy = "organization")
    private List<Repository> repositories;
    @OneToMany(mappedBy = "organization")
    private List<Release> releases;
    @OneToMany(mappedBy = "organization")
    private List<Deployment> deployments;
    @OneToMany(mappedBy = "organization")
    private List<Task> tasks;
    @OneToMany(mappedBy = "organization")
    private List<TestCase> testCases;
    @OneToMany(mappedBy = "organization")
    private List<Bug> bugs;

}

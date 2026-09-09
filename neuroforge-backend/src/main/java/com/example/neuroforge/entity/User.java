package com.example.neuroforge.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn( name = "organization_id")
    private Organization organization;
    @NotBlank
    private String name;
    @NotBlank
    @Column( unique = true, nullable = false)
    private String email;
    @NotBlank
    @Column( nullable = false)
    private String password;
    @Enumerated( EnumType.STRING )
    private Role role;
    @CreationTimestamp
    private LocalDateTime created_at;
    @OneToMany( mappedBy = "projectManager")
    private List<Project> projects;
    @OneToMany( mappedBy = "businessAnalyst")
    private List<Requirement> requirements;
    @OneToMany( mappedBy = "createdBy")
    private List<Report> reports;
    @OneToMany( mappedBy = "createdBy")
    private List<Document> documents;
    @OneToMany( mappedBy = "devopsEngineer")
    private List<Deployment> deployments;
    @OneToMany( mappedBy = "assignedDeveloper")
    private List<Task> tasks;
    @OneToMany( mappedBy = "projectManager")
    private List<Task> tasksCreatedBy;
    @OneToMany( mappedBy = "qaEngineer")
    private List<TestCase> testCases;
    @OneToMany( mappedBy = "qaEngineer")
    private List<Bug> bugs;
    @OneToMany( mappedBy = "projectManager")
    private List<Sprint> sprints;

}

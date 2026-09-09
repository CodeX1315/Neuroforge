package com.example.neuroforge.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Requirement {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private Long id;
    @ManyToOne
    @JoinColumn( name = "business_analyst_id", nullable = false)
    private User businessAnalyst;
    @ManyToOne
    @JoinColumn( name = "project_id", nullable = false)
    private Project project;
    @ManyToOne
    @JoinColumn(name = "organization_id",nullable = false)
    private Organization organization;
    @NotNull
    @Column( nullable = false)
    private String title;
    @Column( nullable = false)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column( nullable = false)
    private RequirementPriority requirementPriority;
    @Enumerated(EnumType.STRING)
    @Column( nullable = false )
    private RequirementStatus requirementStatus;
    @OneToMany( mappedBy = "requirement")
    private List<Task> tasks;
}

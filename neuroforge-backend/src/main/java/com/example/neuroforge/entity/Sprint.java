package com.example.neuroforge.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sprint {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn( name = "project_id", nullable = false)
    private Project project;
    @ManyToOne
    @JoinColumn( name = "project_manager_id", nullable = false)
    private User projectManager;
    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    @Column( nullable = false)
    @NotNull
    private String name;
    @Column( nullable = false)
    private LocalDate start_date;
    @Column( nullable = false)
    private LocalDate end_date;
    @Column( nullable = false)
    private String goal;
    @OneToMany( mappedBy = "sprint")
    private List<Release> releases;
    @OneToMany( mappedBy = "sprint")
    private List<Task> tasks;

}

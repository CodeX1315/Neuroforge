package com.example.neuroforge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deployment {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "release_id", nullable = false)
    private Release release;
    @ManyToOne
    @JoinColumn(name = "devops_engineer_id", nullable = false)
    private User devopsEngineer;
    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    @Column( nullable = false)
    @Enumerated(EnumType.STRING)
    private Environment environment;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeploymentStatus deploymentStatus;
    @Column(nullable = false)
    private LocalDate deployAt;
}

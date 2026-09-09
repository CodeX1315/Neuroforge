package com.example.neuroforge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bug {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn( name = "testCaseId", nullable = false)
    private TestCase testCase;
    @ManyToOne
    @JoinColumn( name = "task_id", nullable = false)
    private Task task;
    @ManyToOne
    @JoinColumn( name = "qa_id", nullable = false)
    private User qaEngineer;
    @ManyToOne
    @JoinColumn( name = "organization_id", nullable = false)
    private Organization organization;
    @Column( nullable = false)
    private String title;
    @Column( nullable = false)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column( nullable = false)
    private BugSeverity bugSeverity;
    @Enumerated(EnumType.STRING)
    @Column( nullable = false)
    private BugStatus bugStatus;
}

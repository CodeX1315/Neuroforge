package com.example.neuroforge.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn( name = "sprint_id", nullable = false)
    private Sprint sprint;
    @ManyToOne
    @JoinColumn( name = "requirement_id", nullable = false)
    private Requirement requirement;
    @ManyToOne
    @JoinColumn( name = "developer_id", nullable = false)
    private User assignedDeveloper;
    @ManyToOne
    @JoinColumn( name = "creator_id", nullable = false)
    private User projectManager;
    @ManyToOne
    @JoinColumn(name = "organization_id",nullable = false)
    private Organization organization;
    @Column( nullable = false)
    private String title;
    @Column( nullable = false)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column( nullable = false)
    private TaskStatus taskStatus;
    @Column( nullable = false)
    @Enumerated(EnumType.STRING)
    private TaskPriority taskPriority;
    @Column( nullable = false)
    @Min(1)
    private Integer estimatedHours;
    @OneToMany( mappedBy = "task")
    private List<TestCase> testCases;
    @OneToMany( mappedBy = "task")
    private List<Bug> bugs;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}

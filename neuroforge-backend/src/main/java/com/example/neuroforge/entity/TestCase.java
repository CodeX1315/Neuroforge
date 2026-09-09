package com.example.neuroforge.entity;

import jakarta.persistence.*;
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
public class TestCase {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn( name = "task_id", nullable = false)
    private Task task;
    @ManyToOne
    @JoinColumn( name = "qa_id", nullable = false)
    private User qaEngineer;
    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    @Column( nullable = false)
    private String title;
    @Column( nullable = false)
    private String steps;
    @Column( nullable = false)
    private String expectedResult;
    @Enumerated(EnumType.STRING)
    @Column( nullable = false)
    private TestCaseStatus testCaseStatus;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    @OneToMany( mappedBy = "testCase")
    private List<Bug> bugs;
}

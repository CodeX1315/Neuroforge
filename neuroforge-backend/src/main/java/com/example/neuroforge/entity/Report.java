package com.example.neuroforge.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn( name = "creator_id", nullable = false)
    private User createdBy;
    @ManyToOne
    @JoinColumn( name = "project_id", nullable = false)
    private Project project;
    @ManyToOne
    @JoinColumn(name = "organization_id",nullable = false)
    private Organization organization;
    @Column( nullable = false)
    private String title;
    @Enumerated(EnumType.STRING)
    @Column( nullable = false)
    private ReportType reportType;
    @CreationTimestamp
    @Column( nullable = false)
    private LocalDateTime generated_date;
    @Column( nullable = false)
    private String data;
}

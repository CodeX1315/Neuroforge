package com.example.neuroforge.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn( name = "project_id", nullable = false)
    private Project project;
    @ManyToOne
    @JoinColumn( name = "user_id", nullable = false)
    private User createdBy;
    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    @Column( nullable = false)
    private String title;
    @Column( nullable = false)
    @Enumerated(EnumType.STRING)
    private DocumentType documentType;
    @Column( nullable = false, columnDefinition = "LONGTEXT")
    private String data;
    @CreationTimestamp
    private LocalDateTime created_at;
    @UpdateTimestamp
    private LocalDateTime updated_at;

}

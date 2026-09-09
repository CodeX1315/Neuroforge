package com.example.neuroforge.repository;

import com.example.neuroforge.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    boolean existsByTitleAndProjectAndOrganization(String title, Project project, Organization organization);
    List<Document> findAllByDocumentTypeAndProject(DocumentType documentType,Project project);
    List<Document> findAllByDocumentTypeAndProjectAndCreatedBy(DocumentType documentType, Project project, User user);
    List<Document> findAllByOrganization(Organization organization);

}

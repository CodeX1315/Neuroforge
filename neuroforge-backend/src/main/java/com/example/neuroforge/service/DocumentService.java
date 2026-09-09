package com.example.neuroforge.service;

import com.example.neuroforge.dto.DocumentCreateRequest;
import com.example.neuroforge.dto.DocumentCreateResponse;
import com.example.neuroforge.dto.DocumentUpdateRequest;
import com.example.neuroforge.entity.*;
import com.example.neuroforge.exception.OrganizationNotFoundException;
import com.example.neuroforge.mapper.DocumentMapper;
import com.example.neuroforge.repository.DocumentRepository;
import com.example.neuroforge.repository.OrganizationRepository;
import com.example.neuroforge.repository.ProjectRepository;
import com.example.neuroforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class DocumentService {
    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private DocumentMapper documentMapper;

    public DocumentCreateResponse createDocument(DocumentCreateRequest createRequest) throws AccessDeniedException, ReflectiveOperationException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User documentCreator = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found "));
        Organization organization = organizationRepository.findById(documentCreator.getOrganization().getId()).orElseThrow(
                () -> new OrganizationNotFoundException("Organization not found"));
        Project project = projectRepository.findById(createRequest.projectId()).orElseThrow(()-> new RuntimeException("Project not found"));
        if (!documentCreator.getOrganization().getId().equals(project.getOrganization().getId())){
            throw new AccessDeniedException("You can't create document for another organization");
        }
        if (documentRepository.existsByTitleAndProjectAndOrganization(createRequest.title(), project, organization)){
            throw new ReflectiveOperationException("Document already exists");
        }

        Document document = Document.builder()
                .project(project)
                .createdBy(documentCreator)
                .organization(organization)
                .title(createRequest.title())
                .data(createRequest.data())
                .documentType(createRequest.documentType())
                .build();
        documentRepository.save(document);
        return documentMapper.documentCreateDto(document);
    }

    public DocumentCreateResponse getDocumentById(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User documentCreator = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found "));
        Document document = documentRepository.findById(id).orElseThrow(()-> new RuntimeException("Document not found"));
        if (!documentCreator.getOrganization().getId().equals(document.getOrganization().getId())){
            throw new AccessDeniedException("You can't receive document from another organization");
        }

        return documentMapper.documentCreateDto(document);
    }

    public List<DocumentCreateResponse> getDocumentsByDocTypeAndRelatedProject(Long projectId, DocumentType documentType){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User documentCreator = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found "));
        Project project = projectRepository.findById(projectId).orElseThrow(()-> new RuntimeException("Project not found"));
        List<Document> documents = new ArrayList<>();
        documents = documentRepository.findAllByDocumentTypeAndProject(documentType, project);
        return documents.stream()
                .map(document -> DocumentCreateResponse.builder()
                        .id(document.getId())
                        .title(document.getTitle())
                        .documentType(document.getDocumentType())
                        .data(document.getData())
                        .creatorId(document.getCreatedBy().getId())
                        .build()).toList();
    }

    public List<DocumentCreateResponse> getDocumentCreatedByUser(Long projectId, DocumentType documentType){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User documentCreator = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found "));
        Project project = projectRepository.findById(projectId).orElseThrow(()-> new RuntimeException("Project not found"));
        List<Document> documents = new ArrayList<>();
        documents = documentRepository.findAllByDocumentTypeAndProjectAndCreatedBy(documentType, project, documentCreator);
        return documents.stream()
                .map(document -> DocumentCreateResponse.builder()
                        .id(document.getId())
                        .title(document.getTitle())
                        .documentType(document.getDocumentType())
                        .data(document.getData())
                        .creatorId(document.getCreatedBy().getId())
                        .build()).toList();
    }

    public DocumentUpdateRequest updateDocument(Long id,DocumentUpdateRequest updateRequest) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User documentCreator = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found "));
        Document document = documentRepository.findById(id).orElseThrow(()-> new RuntimeException("Document not found"));
        if (documentCreator.getId().equals(document.getOrganization().getId())){
            throw new AccessDeniedException("You can't update document of another organization");
        }

        if (updateRequest.data()!=null){
            document.setData(updateRequest.data());
        }
        documentRepository.save(document);
        return DocumentUpdateRequest.builder()
                .data(document.getData())
                .build();
    }

    public void deleteDocument(Long id) throws AccessDeniedException {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User documentCreator = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("user not found "));
        Document document = documentRepository.findById(id).orElseThrow(()-> new RuntimeException("Document not found"));
        if (documentCreator.getId().equals(document.getOrganization().getId())){
            throw new AccessDeniedException("You can't remove document of another organization");
        }
        documentRepository.delete(document);
    }
}

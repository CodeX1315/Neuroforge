package com.example.neuroforge.controller;

import com.example.neuroforge.dto.DocumentCreateRequest;
import com.example.neuroforge.dto.DocumentCreateResponse;
import com.example.neuroforge.dto.DocumentUpdateRequest;
import com.example.neuroforge.entity.DocumentType;
import com.example.neuroforge.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/document")
public class DocumentController {
    @Autowired
    private DocumentService documentService;

    @PostMapping("/create")
    public ResponseEntity<DocumentCreateResponse> createDocument(@RequestBody DocumentCreateRequest createRequest) throws AccessDeniedException, ReflectiveOperationException {
        DocumentCreateResponse response = documentService.createDocument(createRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<DocumentCreateResponse> getDocumentById(@PathVariable Long id) throws AccessDeniedException {
        DocumentCreateResponse responses = documentService.getDocumentById(id);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<DocumentCreateResponse>> getAllDocumentsByTypeAndProject(@RequestParam Long projectId, @RequestParam DocumentType type){
        List<DocumentCreateResponse> responses =documentService.getDocumentsByDocTypeAndRelatedProject(projectId, type);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/get-all/creator")
    public ResponseEntity<List<DocumentCreateResponse>> getAllDocumentCreatedByUser(@RequestParam Long projectId, @RequestParam DocumentType type){
        List<DocumentCreateResponse> responses = documentService.getDocumentCreatedByUser(projectId, type);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<DocumentUpdateRequest> updateDocument(@PathVariable Long id,@RequestBody DocumentUpdateRequest updateRequest) throws AccessDeniedException {
        DocumentUpdateRequest response = documentService.updateDocument(id, updateRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long id) throws AccessDeniedException {
        documentService.deleteDocument(id);
        return new ResponseEntity<>("Document deleted successfully", HttpStatus.OK);
    }
}

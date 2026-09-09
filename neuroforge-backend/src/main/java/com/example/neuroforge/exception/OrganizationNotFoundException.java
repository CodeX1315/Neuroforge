package com.example.neuroforge.exception;

public class OrganizationNotFoundException extends RuntimeException{
    public OrganizationNotFoundException(String message) {
        super(message);
    }
}

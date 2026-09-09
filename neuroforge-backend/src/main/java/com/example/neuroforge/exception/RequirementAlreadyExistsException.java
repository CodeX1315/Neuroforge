package com.example.neuroforge.exception;

public class RequirementAlreadyExistsException extends RuntimeException{
    public RequirementAlreadyExistsException(String message) {
        super(message);
    }
}

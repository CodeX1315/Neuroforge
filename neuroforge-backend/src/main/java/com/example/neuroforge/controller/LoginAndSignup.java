package com.example.neuroforge.controller;

import com.example.neuroforge.dto.*;
import com.example.neuroforge.repository.UserRepository;
import com.example.neuroforge.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class
LoginAndSignup {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/workspace/admin")
    public ResponseEntity<WorkspaceResponse> registerOrgAndAdmin(@RequestBody CreateWorkspaceRequest request){
        WorkspaceResponse workspaceResponse = authenticationService.registerWorkspace(request);
        return new ResponseEntity<>(workspaceResponse, HttpStatus.CREATED);
    }

    @PostMapping("/user/signup")
    public ResponseEntity<UserRegisterResponse> userRegister(@RequestBody UserRegisterRequest registerRequest){
        UserRegisterResponse registerResponse = authenticationService.registerUser(registerRequest);
        return new ResponseEntity<>(registerResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<String> userLogin(@RequestBody LoginRequest loginRequest){
        return authenticationService.loginUser(loginRequest);
    }
}

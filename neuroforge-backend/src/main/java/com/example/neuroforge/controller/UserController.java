package com.example.neuroforge.controller;

import com.example.neuroforge.dto.UpdatePasswordRequest;
import com.example.neuroforge.dto.UpdateUserRequest;
import com.example.neuroforge.dto.UserRegisterResponse;
import com.example.neuroforge.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserRegisterResponse> userProfile(){
        UserRegisterResponse registerResponse = userService.userProfile();
        return new ResponseEntity<>(registerResponse, HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAccount(){
        String response = userService.deleteUser();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update/password")
    public ResponseEntity<String> updatePassword(@RequestBody UpdatePasswordRequest passwordRequest){
        userService.updatePassword(passwordRequest);
        return new ResponseEntity<>("Password update successfully", HttpStatus.CREATED);
    }

    @PutMapping("/update/profile")
    public ResponseEntity<UpdateUserRequest> updateUserDetails(@RequestBody UpdateUserRequest userRequest){
        UpdateUserRequest response = userService.updateUserInformation(userRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}

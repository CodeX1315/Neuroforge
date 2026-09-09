package com.example.neuroforge.service;

import com.example.neuroforge.dto.UpdatePasswordRequest;
import com.example.neuroforge.dto.UpdateUserRequest;
import com.example.neuroforge.dto.UserRegisterResponse;
import com.example.neuroforge.entity.Role;
import com.example.neuroforge.entity.User;
import com.example.neuroforge.exception.LastAdminDeletionException;
import com.example.neuroforge.mapper.UserMapper;
import com.example.neuroforge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserRegisterResponse userProfile(){
        String username = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userMapper.toUserResponseDto(user);
    }

    public String deleteUser(){
        String username = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        if (user.getRole() == Role.ADMIN) {

            long adminCount = userRepository
                    .countByOrganizationAndRole(
                            user.getOrganization(),
                            Role.ADMIN
                    );

            if (adminCount <= 1) {
                throw new LastAdminDeletionException(
                        "You are the only administrator in this organization. "
                );
            }
        }
        userRepository.delete(user);
        return "Delete successfully";
    }

    public void updatePassword(UpdatePasswordRequest updatePassword){
        String username = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(updatePassword.oldPassword(),user.getPassword())){
            throw new RuntimeException("Old Password is incorrect");
        }

        if (passwordEncoder.matches(updatePassword.newPassword(), user.getPassword())){
            throw new RuntimeException("New password and Old password can't be same");
        }

        if (!updatePassword.newPassword().equals(updatePassword.confirmedPassword())){
            throw new RuntimeException("New password and confirmed password not matches");
        }

        user.setPassword(passwordEncoder.encode(updatePassword.newPassword()));
        userRepository.save(user);
    }

    public UpdateUserRequest updateUserInformation(UpdateUserRequest userRequest){
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        User user = userRepository.findByEmail(email).orElseThrow( () -> new UsernameNotFoundException("User not found"));

        if (userRequest.name()!=null){
            user.setName(userRequest.name());
        }

        if (userRequest.email()!=null){
            user.setEmail(userRequest.email());
        }

        userRepository.save(user);
        return UpdateUserRequest.builder()
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}

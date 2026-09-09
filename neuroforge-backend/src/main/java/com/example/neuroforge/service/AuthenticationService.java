package com.example.neuroforge.service;

import com.example.neuroforge.dto.*;
import com.example.neuroforge.entity.Organization;
import com.example.neuroforge.entity.Role;
import com.example.neuroforge.entity.User;
import com.example.neuroforge.exception.OrganizationNotFoundException;
import com.example.neuroforge.mapper.OrganizationMapper;
import com.example.neuroforge.mapper.UserMapper;
import com.example.neuroforge.repository.OrganizationRepository;
import com.example.neuroforge.repository.UserRepository;
import com.example.neuroforge.exception.EmailAlreadyExistException;
import com.example.neuroforge.utils.JwtUtility;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class AuthenticationService {

    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtUtility jwtUtility;
    @Autowired
    private OrganizationMapper organizationMapper;
    @Autowired
    private UserMapper userMapper;

    private String generateInviteCode(String organizationName) {

        String prefix = organizationName
                .replaceAll("[^a-zA-Z0-9]", "")
                .substring(0, Math.min(3, organizationName.length()))
                .toUpperCase();

        String code;

        do {
            String randomPart = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 6)
                    .toUpperCase();

            code = prefix + "-" + randomPart;

        } while (organizationRepository.existsByInviteCode(code));

        return code;
    }

    @Transactional
    public WorkspaceResponse registerWorkspace(CreateWorkspaceRequest request){

        if (userRepository.existsByEmail(request.email())){
            throw new EmailAlreadyExistException("Email already registered");
        }

        String inviteCode = generateInviteCode(request.organizationName());

        Organization workspace = Organization.builder()
                .organizationName(request.organizationName())
                .inviteCode(inviteCode)
                .build();
        organizationRepository.save(workspace);

        User admin = User.builder()
                .name(request.adminName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.ADMIN)
                .organization(workspace)
                .build();
        userRepository.save(admin);

        return organizationMapper.toWorkspaceResponseDto(workspace);
    }

    @Transactional
    public UserRegisterResponse registerUser(UserRegisterRequest registerRequest){
        if(userRepository.existsByEmail(registerRequest.email())){
            throw new EmailAlreadyExistException("User Already Exist ");
        }

        Organization org = organizationRepository.findByInviteCode(registerRequest.inviteCode()).orElseThrow(
                () -> new OrganizationNotFoundException("Organization not found"));

        User newUser = User.builder()
                .name(registerRequest.name())
                .email(registerRequest.email())
                .password(passwordEncoder.encode(registerRequest.password()))
                .role(Role.USER)
                .organization(org)
                .build();
        userRepository.save(newUser);
        return userMapper.toUserResponseDto(newUser);
    }

    public ResponseEntity<String> loginUser(LoginRequest loginRequest){
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.email());
            String jwt = jwtUtility.generateToken(userDetails.getUsername());
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Exception occur while creatingAuthenticationToken", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username or password is wrong");
        }
    }
}

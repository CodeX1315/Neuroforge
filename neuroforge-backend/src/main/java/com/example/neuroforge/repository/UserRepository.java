package com.example.neuroforge.repository;

import com.example.neuroforge.entity.Organization;
import com.example.neuroforge.entity.Role;
import com.example.neuroforge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByOrganizationId(Long organizationId);
    long countByOrganizationAndRole(Organization organization, Role role
    );
}

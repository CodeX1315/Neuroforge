package com.example.neuroforge.repository;

import com.example.neuroforge.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByInviteCode(String inviteCode);
    boolean existsByInviteCode(String inviteCode);
}

package com.example.neuroforge.mapper;


import com.example.neuroforge.dto.UpdateUserRequest;
import com.example.neuroforge.dto.UserRegisterResponse;
import com.example.neuroforge.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "username", source = "name")
    @Mapping(target = "organizationId", source = "organization.id")
    @Mapping(target = "orgName", source = "organization.organizationName")
    UserRegisterResponse toUserResponseDto(User user);
}

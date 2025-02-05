package com.ShareWhere.ShareWhere.models;

import com.ShareWhere.ShareWhere.DTOs.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SignupResponse {
    private String token;
    private String message;
    private UserDTO user;
}

package com.ShareWhere.ShareWhere.models;

import com.ShareWhere.ShareWhere.DTOs.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Builder
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String message;
    private UserDTO user;
}

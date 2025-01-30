package com.ShareWhere.ShareWhere.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SignupResponse {
    private String username;
    private String email;
    private String role;
    private String token;
    private String message;
    private User user;

    public SignupResponse(String message) {
        this.message = message;
    }
}

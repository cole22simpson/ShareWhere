package com.ShareWhere.ShareWhere.models;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private String token;
    private String message;
    private User user;

    public LoginResponse(String token, String message, User user) {
        this.token = token;
        this.message = message;
        this.user = user;
    }
}

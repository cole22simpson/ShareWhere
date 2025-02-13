package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.User;
import com.ShareWhere.ShareWhere.models.UserProfile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToOne;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserDTO {
    private int userId;
    private String username;
    private String name;
    private String email;
    private Double latitude;
    private Double longitude;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserProfileDTO profile;

    public UserDTO(User user) {
        this.userId = user.getUserId();
        this.username = user.getUsername();
        this.name = user.getName();
        this.email = user.getEmail();
        this.latitude = user.getLatitude();
        this.longitude = user.getLongitude();
        this.role = user.getRole();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
        this.profile = new UserProfileDTO(user.getProfile());
    }
}

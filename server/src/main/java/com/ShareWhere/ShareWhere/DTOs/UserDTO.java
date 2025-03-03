package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.User;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
public class UserDTO {
    private int userId;
    private String username;
    private String name;
    private String email;
    private Double latitude;
    private Double longitude;
    private String city;
//    private String latitudeHemisphere;
//    private String longitudeHemisphere;
    private String role;
    private Set<Integer> followers = new HashSet<>();
    private Set<Integer> following = new HashSet<>();
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
        this.city = user.getCity();
//        this.latitudeHemisphere = user.getLatitudeHemisphere();
//        this.longitudeHemisphere = user.getLongitudeHemisphere();
        this.role = user.getRole();
        for (User follower : user.getFollowers()) {
            followers.add(follower.getUserId());
        }
        for (User follow : user.getFollowing()) {
            following.add(follow.getUserId());
        }
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
        this.profile = new UserProfileDTO(user.getProfile());
    }
}

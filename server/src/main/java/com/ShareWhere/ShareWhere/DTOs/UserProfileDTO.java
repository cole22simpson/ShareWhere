package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.Image;
import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.models.User;
import com.ShareWhere.ShareWhere.models.UserProfile;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class UserProfileDTO {
    private int profileId;
    private int userId;
    private String bio = "";
    private ImageDTO profilePic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<LocationDTO> userPosts = new ArrayList<>();
    private List<LocationDTO> savedLocations = new ArrayList<>();

    public UserProfileDTO(UserProfile userProfile) {
        this.profileId = userProfile.getProfileId();
        this.userId = userProfile.getUser().getUserID();
        this.bio = userProfile.getBio();
        this.profilePic = new ImageDTO(userProfile.getProfilePic());
        this.createdAt = userProfile.getCreatedAt();
        this.updatedAt = userProfile.getUpdatedAt();
        for (Location location : userProfile.getUserPosts()) {
            userPosts.add(new LocationDTO(location));
        }
        for (Location location : userProfile.getSavedLocations()) {
            savedLocations.add(new LocationDTO(location));
        }
    }
}

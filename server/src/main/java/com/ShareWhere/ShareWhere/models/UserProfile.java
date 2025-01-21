package com.ShareWhere.ShareWhere.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "user_profile")
public class UserProfile {

    private static final String DEFAULT_PROFILE_PIC = "../assets/images/default_image.png";

    @Id
    private int profileID;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private String bio = "";

    private String profilePicName = DEFAULT_PROFILE_PIC;
//    private String profilePicImgType;
//    @Lob
//    private byte[] imageData;

    /* Collections that have a many to many relationship shouls take int o consideration the importance
    of order and duplicates. If duplicates are allowed, then a list is acceptable.
    If dupes are not allowed, but order is needed, then a sorted set is fine.
     */
    @ManyToMany
    @JoinTable(
            name = "user_posted_locations",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "location_id")
    )
    private List<Location> userPosts;

    @ManyToMany
    @JoinTable(
            name = "user_saved_locations",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "location_id")
    )
    private List<Location> savedLocations;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    protected UserProfile() {}

    // private List<User> followers = new ArrayList<>();
    // private List<User> following = new ArrayList<>();

    public UserProfile(User user) {
        this.user = user;
        this.userPosts = new ArrayList<>();
        this.savedLocations = new ArrayList<>();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

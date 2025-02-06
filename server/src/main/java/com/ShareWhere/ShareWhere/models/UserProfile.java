package com.ShareWhere.ShareWhere.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "user_profile")
public class UserProfile {
    @Id
    private int profileId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(length = 160)
    private String bio = "";

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_pic_id", referencedColumnName = "imageId")
    private Image profilePic;
//    private String profilePicImgType;
//    @Lob
//    private byte[] imageData;

    /* Collections that have a many to many relationship shouls take int o consideration the importance
    of order and duplicates. If duplicates are allowed, then a list is acceptable.
    If dupes are not allowed, but order is needed, then a sorted set is fine.
     */
    @OneToMany(
            mappedBy = "createdBy",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonBackReference
    private List<Location> userPosts = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_saved_locations",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "location_id")
    )
    private List<Location> savedLocations = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    protected UserProfile() {}

    // private List<User> followers = new ArrayList<>();
    // private List<User> following = new ArrayList<>();

    public UserProfile(User user) {
        this.user = user;
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

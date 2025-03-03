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
import java.util.Objects;

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
    @JsonIgnore
    private Image profilePic;

    @OneToMany(
            mappedBy = "createdBy",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List<Location> userPosts = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_saved_locations",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "location_id")
    )
    @JsonIgnore
    private List<Location> savedLocations = new ArrayList<>();

    @OneToMany(mappedBy = "writtenBy", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comment> userComments = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    protected UserProfile() {}

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

    public boolean equals(UserProfile profile) {
        return this.profileId == profile.getProfileId();
    }

    public int hashCode() {
        return Objects.hash(profileId);
    }
}
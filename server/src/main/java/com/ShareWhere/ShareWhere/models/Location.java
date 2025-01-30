package com.ShareWhere.ShareWhere.models;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int locationId;

    @Column(nullable = false, length = 80)
    private String locationName;

    @Column(nullable = false, length = 1200)
    private String locationDescription;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private int saves = 0;

//    private final int createdBy;

    private boolean isApproved = false;
    LocalDateTime timeCreated = LocalDateTime.now();

    @ManyToMany
    @JoinTable(
            name = "location_comments",
            joinColumns = @JoinColumn(name = "location_id"),
            inverseJoinColumns = @JoinColumn(name = "comment_id")
    )
    private List<Comment> comments = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name= "location_images",
            joinColumns = @JoinColumn(name = "location_id"))
    @Column(name = "image_url", nullable = false)
    private List<String> images = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "location_tags", // table to manage the association
            joinColumns = @JoinColumn(name = "location_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Column(nullable = false)
    private List<Tag> tags = new ArrayList<>();

    public Location() {}

    public Location(String locationName, String locationDescription,
                    double latitude, double longitude,
                    List<String> images, List<Tag> tags) {
        this.locationName = locationName;
        this.locationDescription = locationDescription;
        this.latitude = latitude;
        this.longitude = longitude;
        this.images = images;
        this.tags = tags;
    }
}

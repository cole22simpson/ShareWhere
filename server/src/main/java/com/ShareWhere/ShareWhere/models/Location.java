package com.ShareWhere.ShareWhere.models;

import jakarta.persistence.*;
import lombok.Data;

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

    @Column(nullable = false)
    private String locationName;

    @Column(nullable = false)
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
//    private List<String> images;

    @ManyToMany
    @JoinTable(
            name = "location_tags", // table to manage the association
            joinColumns = @JoinColumn(name = "location_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    public Location() {}

    public Location(String locationName, String locationDescription,
                    double latitude, double longitude, String address) {
        this(locationName, locationDescription, latitude, longitude, address, new ArrayList<>(), new ArrayList<>());
    }

    public Location(String locationName, String locationDescription,
                    double latitude, double longitude, String address,
                    List<Tag> tags) {
        this(locationName, locationDescription, latitude, longitude, address, tags, new ArrayList<>());
    }

    public Location(String locationName, String locationDescription,
                    double latitude, double longitude, String address,
                    List<Tag> tags, List<Comment> comments) {
        this.locationName = locationName;
        this.locationDescription = locationDescription;
        this.latitude = latitude;
        this.longitude = longitude;
        this.tags.addAll(tags);
        this.comments.addAll(comments);
    }
}

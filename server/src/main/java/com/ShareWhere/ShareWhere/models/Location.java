package com.ShareWhere.ShareWhere.models;

import com.ShareWhere.ShareWhere.DTOs.LocationDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@Data
//@ToString(exclude = {"images", "comments", "tags"})
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

    @Column(nullable = false)
    private String city;

//    @Column(nullable = false)
//    private String latitudeHemisphere;
//
//    @Column(nullable = false)
//    private String longitudeHemisphere;

    @Column(nullable = false)
    private int saves;

    @Column(nullable = false)
    private String pinType;

    @Column(nullable = false)
    private boolean isApproved = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    @JsonIgnore
    private UserProfile createdBy;

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Image> images;

    @ManyToMany
    @JoinTable(
            name = "location_tags", // table to manage the association
            joinColumns = @JoinColumn(name = "location_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @JsonIgnore
    private Set<Tag> tags = new HashSet<>();

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();

    @ManyToMany(mappedBy = "savedLocations")
    @JsonIgnore
    private Set<UserProfile> savedBy = new HashSet<>();

    public Location() {}

    public Location(String locationName, String locationDescription,
                    double latitude, double longitude, String city, String pinType,
                    Set<Tag> tags) {
        this(locationName, locationDescription, latitude, longitude, city, pinType, tags, null);
    }

    public Location(String locationName, String locationDescription,
                    double latitude, double longitude, String city, String pinType,
                    Set<Tag> tags, UserProfile createdBy) {
        this.locationName = locationName;
        this.locationDescription = locationDescription;
        this.latitude = latitude;
        this.longitude = longitude;
        this.city = city;
//        this.latitudeHemisphere = this.getLatitudeHemisphere();
//        this.longitudeHemisphere = this.getLongitudeHemisphere();
        this.pinType = pinType;
        this.tags = tags;
        this.saves = 0;
        this.createdBy = createdBy;
    }

    public boolean isSavedByUser(UserProfile userProfile) {
        return savedBy.contains(userProfile);
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

    public LocationDTO toLocationDTO() {
        return new LocationDTO(this);
    }

    public boolean equals(Location location) {
        return this.locationId == location.getLocationId();
    }

    public int hashCode() {
        return Objects.hash(locationId);
    }

//    public String getLatitudeHemisphere() {
//        return latitude > 0 ? "N" : latitude < 0 ? "S" : "";
//    }
//
//    public String getLongitudeHemisphere() {
//        return longitude > 0 ? "E" : longitude < 0 ? "W" : "";
//    }
}

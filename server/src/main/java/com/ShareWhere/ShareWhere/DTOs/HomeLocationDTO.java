package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.models.Tag;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
public class HomeLocationDTO {
    private int locationId;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private String city;
//    private String latitudeHemisphere;
//    private String longitudeHemisphere;
    private int createdByProfileID;
    private ImageDTO creatorProfilePic;
    private Set<TagDTO> tags = new HashSet<>();
    private String creatorUsername;
    private ImageDTO previewImage;
    private LocalDateTime createdAt;
    private Integer saves;

    public HomeLocationDTO(Location location) {
        this.locationId = location.getLocationId();
        this.locationName = location.getLocationName();
        this.latitude = location.getLatitude();
        this.longitude = location.getLongitude();
        this.creatorProfilePic = new ImageDTO(location.getCreatedBy().getProfilePic());
        this.creatorUsername = location.getCreatedBy().getUser().getUsername();
        this.createdByProfileID = location.getCreatedBy().getProfileId();
        for (Tag tag : location.getTags()) {
            this.tags.add(new TagDTO(tag));
        }
        this.city = location.getCity();
//        this.latitudeHemisphere = location.getLatitudeHemisphere();
//        this.longitudeHemisphere = location.getLongitudeHemisphere();
        this.saves = location.getSaves();
        this.createdAt = location.getCreatedAt();
        this.previewImage = new ImageDTO(location.getImages().get(0));
    }
}

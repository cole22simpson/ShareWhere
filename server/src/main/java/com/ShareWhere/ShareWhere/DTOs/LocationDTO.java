package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class LocationDTO {
    private int locationId;
    private String locationName;
    private String locationDescription;
    private Double latitude;
    private Double longitude;
    private String city;
//    private String latitudeHemisphere;
//    private String longitudeHemisphere;
    private String pinType;
    private List<ImageDTO> images = new ArrayList<>();
    private Integer saves;
    private int createdByProfileID;
    private ImageDTO creatorProfilePic;
    private String creatorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<Integer> savedBy = new HashSet<>();
    private Set<TagDTO> tags = new HashSet<>();
    private List<CommentDTO> comments = new ArrayList<>();

    // Constructor
    public LocationDTO(Location location) {
        this.locationId = location.getLocationId();
        this.locationName = location.getLocationName();
        this.locationDescription = location.getLocationDescription();
        this.latitude = location.getLatitude();
        this.longitude = location.getLongitude();
        this.city = location.getCity();
//        this.latitudeHemisphere = location.getLatitudeHemisphere();
//        this.longitudeHemisphere = location.getLongitudeHemisphere();
        this.pinType = location.getPinType();
        for (Image image : location.getImages()) {
            this.images.add(new ImageDTO(image));
        }
        this.saves = location.getSaves();
        this.createdByProfileID = location.getCreatedBy().getProfileId();
        this.creatorProfilePic = new ImageDTO(location.getCreatedBy().getProfilePic());
        this.creatorName = location.getCreatedBy().getUser().getUsername();
        this.createdAt = location.getCreatedAt();
        this.updatedAt = location.getUpdatedAt();
        this.savedBy.addAll(location.getSavedBy());
        for (Tag tag : location.getTags()) {
            this.tags.add(new TagDTO(tag));
        }
        for (Comment comment : location.getComments()) {
            this.comments.add(new CommentDTO(comment));
        }
    }
}

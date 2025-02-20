package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.models.Tag;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class LocationPreviewDTO {
    private int locationId;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private String city;
    private String pinType;
    private List<TagDTO> tags = new ArrayList<>();
    private ImageDTO previewImage;
    private Integer saves;

    public LocationPreviewDTO(Location location) {
        this.locationId = location.getLocationId();
        this.locationName = location.getLocationName();
        this.latitude = location.getLatitude();
        this.longitude = location.getLongitude();
        this.pinType = location.getPinType();
        this.saves = location.getSaves();
        for (Tag tag : location.getTags()) {
            this.tags.add(new TagDTO(tag));
        }
        this.previewImage = new ImageDTO(location.getImages().get(0));
    }
}

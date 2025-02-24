package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.models.Tag;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class LocationPreviewDTO {
    private int locationId;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private String city;
    private String pinType;
    private ImageDTO previewImage;
    private Set<Tag> tags = new HashSet<>();
    private Integer saves;

    public LocationPreviewDTO(Location location) {
        this.locationId = location.getLocationId();
        this.locationName = location.getLocationName();
        this.latitude = location.getLatitude();
        this.longitude = location.getLongitude();
        this.pinType = location.getPinType();
        this.tags.addAll(location.getTags());
        this.city = location.getCity();
        this.saves = location.getSaves();
        this.previewImage = new ImageDTO(location.getImages().get(0));
    }
}

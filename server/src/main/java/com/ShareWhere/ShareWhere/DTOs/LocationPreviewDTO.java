package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.Location;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class LocationPreviewDTO {
    private int locationId;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private String pinType;
    private ImageDTO previewImage;
    private Integer saves;

    public LocationPreviewDTO(Location location) {
        this.locationId = location.getLocationId();
        this.locationName = location.getLocationName();
        this.latitude = location.getLatitude();
        this.longitude = location.getLongitude();
        this.pinType = location.getPinType();
        this.saves = location.getSaves();
        this.previewImage = new ImageDTO(location.getImages().get(0));
    }
}

package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.Image;
import com.ShareWhere.ShareWhere.models.Location;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
public class ImageDTO {
    private int imageId;
    private String imageName;
    private String imageType;
    private String imageUrl;
//    private byte[] imageData;

    public ImageDTO(Image image) {
        this.imageId = image.getImageId();
        this.imageName = image.getImageName();
        this.imageType = image.getImageType();
        this.imageUrl = image.getImageUrl();
    }
}

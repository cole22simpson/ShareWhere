package com.ShareWhere.ShareWhere.DTOs;

import lombok.Data;

@Data
public class HomeSearchResultDTO {

    private String username;
    private String name;
    private String locationName;
    private String city;
    private int resultId;
    private String imageUrl;
    private String resultType;

    public HomeSearchResultDTO(String username, String name, int resultId, String imageUrl, String resultType) {
        this.username = username;
        this.name = name;
        this.resultId = resultId;
        this.imageUrl = imageUrl;
        this.resultType = resultType;
    }

    public HomeSearchResultDTO(String locationName, int resultId, String imageUrl, String resultType, String city) {
        this.locationName = locationName;
        this.city = city;
        this.resultId = resultId;
        this.imageUrl = imageUrl;
        this.resultType = resultType;
    }
}
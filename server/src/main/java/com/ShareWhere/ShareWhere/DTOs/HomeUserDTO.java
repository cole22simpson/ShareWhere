package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.User;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class HomeUserDTO {
    private int userId;
    private String name;
    private Double latitude;
    private Double longitude;
    private String city;
//    private String latitudeHemisphere;
//    private String longitudeHemisphere;
    private Set<Integer> following = new HashSet<>();
    private List<HomeLocationDTO> followingPosts = new ArrayList<>();

    public HomeUserDTO(User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.latitude = user.getLatitude();
        this.longitude = user.getLongitude();
        for (User follow : user.getFollowing()) {
            following.add(follow.getUserId());
        }
        this.city = user.getCity();
//        this.latitudeHemisphere = user.getLatitudeHemisphere();
//        this.longitudeHemisphere = user.getLongitudeHemisphere();
    }
}

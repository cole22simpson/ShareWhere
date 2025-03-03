package com.ShareWhere.ShareWhere.controllers;

import com.ShareWhere.ShareWhere.DTOs.HomeSearchResultDTO;
import com.ShareWhere.ShareWhere.security.UserPrincipal;
import com.ShareWhere.ShareWhere.services.LocationService;
import com.ShareWhere.ShareWhere.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class HomeController {

    private final UserService userService;
    private final LocationService locationService;

    public HomeController(UserService userService, LocationService locationService) {
        this.userService = userService;
        this.locationService = locationService;
    }

    @RequestMapping("/search")
    public ResponseEntity<List<HomeSearchResultDTO>> search(
            @RequestParam("query") String query
    ) {
        List<HomeSearchResultDTO> users = userService.getAllUsernames(query);
        List<HomeSearchResultDTO> locations = locationService.getAllLocationNames(query);

        List<HomeSearchResultDTO> combinedResults = new ArrayList<>();

        int userIndex = 0;
        int locationIndex = 0;

        while (combinedResults.size() < 10 && userIndex < users.size()) {
            combinedResults.add(users.get(userIndex));
            userIndex++;
        }

        while (combinedResults.size() < 10 && locationIndex < locations.size()) {
            combinedResults.add(locations.get(locationIndex));
            locationIndex++;
        }

        return ResponseEntity.ok(combinedResults);
    }

    @GetMapping("/secured")
    public String secured(@AuthenticationPrincipal UserPrincipal principal) {
        return "If you see this, then you're logged in as user " + principal.getUsername()
                + " User ID: " + principal.getUserId();
    }
}

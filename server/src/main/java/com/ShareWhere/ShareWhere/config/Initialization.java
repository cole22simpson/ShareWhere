package com.ShareWhere.ShareWhere.config;

import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.models.Tag;
import com.ShareWhere.ShareWhere.models.User;
import com.ShareWhere.ShareWhere.services.LocationService;
import com.ShareWhere.ShareWhere.services.TagService;
import com.ShareWhere.ShareWhere.services.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class Initialization implements CommandLineRunner {

    private final UserService userService;
    private final LocationService locationService;
    private final TagService tagService;

    public Initialization(UserService userService, LocationService locationService, TagService tagService) {
        this.userService = userService;
        this.locationService = locationService;
        this.tagService = tagService;
    }

//    private final JsonImportService importJson;
//
//    public Initialization(JsonImportService importJson) {
//        this.importJson = importJson;
//    }

    @Override
    public void run(String... args) throws Exception {
        List<String> tagNames = Arrays.asList(
                "Plenty of parking", "Some parking", "No parking", "Free", "Cheap", "Expensive",
                "Crowded", "Not too crowded", "Not crowded", "Loud", "Quiet", "Better at night",
                "Better in the day", "Long hike", "Short hike", "Can swim", "No swimming",
                "Dog friendly", "No dogs allowed", "Great view", "No cell service", "Good sunsets"
        );

        List<Tag> tags = tagNames.stream()
                .map(Tag::new)
                .toList();

        tags.forEach(tagService::createTag);

        System.out.println("Tags created");
//
//        Location location1 = new Location("The Hideout",
//                "Fun place in San Diego where you can go swimming with some friends.",
//                120.4, 84.1, "5401 Main Street");
//        location1.setTags(Arrays.asList(tags.get(0), tags.get(10), tags.get(15)));
//
//        Location location2 = new Location("The Painted Cave",
//                "This place is hidden just off the path of a hike in Ramona. Inside the cave are some cool paintings.",
//                153.0, -12.9, "21932 Hiking Trail Way");
//        location2.setTags(Arrays.asList(tags.get(1), tags.get(7), tags.get(19)));
//
//        locationService.createLocation(location1);
//        locationService.createLocation(location2);
//
//        System.out.println("Locations inserted");
//
//        User user1 = new User("Cole", "Simpson", "cole22simpson@gmail.com", "cole22simpson", "password");
//        User user2 = new User("Logan", "Simpson", "logan44simpson@gmail.com", "logan44simpson", "password");
//        User user3 = new User("Steve", "Simpson", "stevesimpsonhomelender@gmail.com", "steve_simpson", "password");
//
//        user1.setUserPosts(List.of(location1));
//        user2.setUserPosts(List.of(location2));
//        user1.setSavedLocations(List.of(location2));
//        user3.setSavedLocations(List.of(location1, location2));
//
//        userService.createUser(user1);
//        userService.createUser(user2);
//        userService.createUser(user3);
//
//        System.out.println("Users inserted");

//        importJson.importJSON();
    }
}

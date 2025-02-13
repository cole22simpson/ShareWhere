package com.ShareWhere.ShareWhere.config;

import com.ShareWhere.ShareWhere.controllers.AuthController;
import com.ShareWhere.ShareWhere.models.*;
import com.ShareWhere.ShareWhere.services.LocationService;
import com.ShareWhere.ShareWhere.services.TagService;
import com.ShareWhere.ShareWhere.services.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class Initialization implements CommandLineRunner {

    private final UserService userService;
    private final LocationService locationService;
    private final TagService tagService;
    private final BCryptPasswordEncoder passwordEncoder;

    public Initialization(UserService userService, LocationService locationService, TagService tagService, BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.locationService = locationService;
        this.tagService = tagService;
        this.passwordEncoder = passwordEncoder;
    }

//    private final JsonImportService importJson;
//
//    public Initialization(JsonImportService importJson) {
//        this.importJson = importJson;
//    }

    @Override
    public void run(String... args) throws Exception {

        Map<String, Integer> tagGroups = new HashMap<>();
        tagGroups.putAll(Map.ofEntries(
                Map.entry("Plenty of parking", 1), Map.entry("Some parking", 1), Map.entry("No parking", 1),
                Map.entry("Free", 2), Map.entry("Cheap", 2), Map.entry("Expensive", 2),
                Map.entry("Crowded", 3), Map.entry("Not too crowded", 3), Map.entry("Not crowded", 3),
                Map.entry("Loud", 4), Map.entry("Moderate noise", 4), Map.entry("Quiet", 4),
                Map.entry("Better at night", 5), Map.entry("Better midday", 5), Map.entry("Better in the morning", 5),
                Map.entry("Long hike", 6), Map.entry("Medium hike", 6), Map.entry("Short hike", 6),
                Map.entry("Can swim", 7), Map.entry("No swimming", 7),
                Map.entry("Dog friendly", 8), Map.entry("No dogs allowed", 8),
                Map.entry("Great view", 9), Map.entry("Good sunsets", 9),
                Map.entry("No cell service", 10)
        ));

        List<Tag> tags = tagGroups.entrySet().stream()
                .map(entry -> new Tag(entry.getKey(), entry.getValue()))
                .toList();

        tags.forEach(tagService::createTag);

        System.out.println("Tags created");

        String encodedPassword = passwordEncoder.encode("password");

        User user = new User(
                "cole22simpson@gmail.com",
                encodedPassword,
                "BubbaSimps",
                "Cole Simpson",
                32.93184,
                -117.0669568
        );

        userService.createUser(user);

        System.out.println("User created");


//        List<Tag> locationTags = new ArrayList<>();
//
//        Optional<Tag> tag1 = tagService.getTagById(4);
//        tag1.ifPresent(locationTags::add);
//
//        Optional<Tag> tag2 = tagService.getTagById(19);
//        tag2.ifPresent(locationTags::add);
//
//        Optional<Tag> tag3 = tagService.getTagById(14);
//        tag3.ifPresent(locationTags::add);
//
//        Optional<Tag> tag4 = tagService.getTagById(3);
//        tag4.ifPresent(locationTags::add);
//
//        Optional<Tag> tag5 = tagService.getTagById(11);
//        tag5.ifPresent(locationTags::add);
//
//        UserProfile profile = userService.getUserProfileById(1).orElseThrow(
//                () -> new EntityNotFoundException("User profile not found")
//        );
//
//        Location location1 = new Location(
//                "The Caverns",
//                "This place is unlike anywhere you have ever been before. You venture through dark caverns for miles and you run into bats and graffiti and it is so much fun. I found a caveman on ice here and we took it home and thawed it out and taught it English. This place is unlike anywhere you have ever been before. You venture through dark caverns for miles and you run into bats and graffiti and it is so much fun. I found a caveman on ice here and we took it home and thawed it out and taught it English. This place is unlike anywhere you have ever been before. You venture through dark caverns for miles and you run into bats and graffiti and it is so much fun. I found a caveman on ice here and we took it home and thawed it out and taught it English. This place is unlike anywhere you have ever been before. You venture through dark caverns for miles and you run into bats and graffiti and it is so much fun. I found a caveman on ice here and we took it home and thawed it out and taught it English. This place is unlike anywhere you have ever been before. You venture through dark caverns for miles and you run into bats and graffiti and it is so much fun. I found a caveman on ice here and we took it h",
//                32.9386302783284,
//                -117.08182730092379,
//                locationTags,
//                profile
//        );
//
//        locationService.createLocation(location1);
//
//        System.out.println("Location created");


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

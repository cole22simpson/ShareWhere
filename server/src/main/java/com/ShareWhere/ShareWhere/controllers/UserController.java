package com.ShareWhere.ShareWhere.controllers;

import com.ShareWhere.ShareWhere.DTOs.*;
import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.models.User;
import com.ShareWhere.ShareWhere.services.LocationService;
import com.ShareWhere.ShareWhere.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final LocationService locationService;

    // Constructor Injection
    public UserController(UserService userService, LocationService locationService) {
        this.userService = userService;
        this.locationService = locationService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User newUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable("userId") int userId) {
        return userService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}/posts")
    public ResponseEntity<List<LocationPreviewDTO>> getUserPosts(@PathVariable("userId") int userId) {
        return ResponseEntity.ok(userService.getUserPosts(userId));
    }

    @GetMapping("/{userId}/saved")
    public ResponseEntity<List<LocationPreviewDTO>> getUserSavedPosts(@PathVariable("userId") int userId) {
        return ResponseEntity.ok(userService.getUserSavedPosts(userId));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<HomeUserDTO> getFollowingPosts(@PathVariable("userId") int userId) {
        return ResponseEntity.ok(userService.getFollowingPosts(userId));
    }

    // In goes a save. I need to update the number of saves which would come from the location. I need a list of the locations saved by IDs
    @PatchMapping("/save")
    public ResponseEntity<Set<Integer>> updateUserSavedPosts(
            @RequestParam("userId") int userId,
            @RequestParam("locationId") int locationId,
            @RequestParam("field") String field) {
        Location location = locationService.getLocationById(locationId).orElseThrow(
                () -> new EntityNotFoundException("Location not found")
        );
        Optional<LocationDTO> updatedLocation = userService.updateUser(userId, location, field);
        Set<Integer> savedLocations = updatedLocation
                .map(LocationDTO::getSavedBy)
                .orElse(Collections.emptySet());

        return ResponseEntity.ok(savedLocations);
    }

    @PatchMapping("/follow")
    public ResponseEntity<Set<Integer>> updateUserFollows(
            @RequestParam("followerId") int followerId,
            @RequestParam("followeeId") int followeeId,
            @RequestParam("action") String action) {
        Optional<UserDTO> updatedUser = userService.updateUser(followerId, followeeId, action);
        Set<Integer> following = updatedUser
                .map(UserDTO::getFollowing)
                .orElse(Collections.emptySet());
        return ResponseEntity.ok(following);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable("userId") int userId, @RequestBody User userUpdates) {
        Optional<User> updatedUser = userService.updateUser(userId, userUpdates, false);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{userId}/names")
    public ResponseEntity<UserDTO> updateUserFields(@PathVariable("userId") int userId,
                                                 @RequestParam(value = "newName", required = false) String newName,
                                                 @RequestParam(value = "newUsername", required = false) String newUsername) {
        Optional<UserDTO> updatedUser = userService.updateUser(userId, newName, newUsername, true);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable("userId") int userId) {
        if (userService.deleteUser(userId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping(value = "/{userId}/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDTO> updateUserFields(@PathVariable(value = "userId") int userId,
                                                    @RequestParam(value = "newBio", required = false) String bio,
                                                    @RequestPart(value = "newImage", required = false) MultipartFile image) {
        Optional<UserDTO> updatedUser = userService.updateUser(userId, bio, image, true);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

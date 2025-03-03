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

    @GetMapping("/{user_id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable("user_id") int userId) {
        return userService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{user_id}/posts")
    public ResponseEntity<List<LocationPreviewDTO>> getUserPosts(@PathVariable("user_id") int userId) {
        return ResponseEntity.ok(userService.getUserPosts(userId));
    }

    @GetMapping("/{user_id}/saved")
    public ResponseEntity<List<LocationPreviewDTO>> getUserSavedPosts(@PathVariable("user_id") int userId) {
        return ResponseEntity.ok(userService.getUserSavedPosts(userId));
    }

    @GetMapping("/{user_id}/following")
    public ResponseEntity<HomeUserDTO> getFollowingPosts(@PathVariable("user_id") int userId) {
        return ResponseEntity.ok(userService.getFollowingPosts(userId));
    }

    // In goes a save. I need to update the number of saves which would come from the location. I need a list of the locations saved by IDs
    @PatchMapping("/save")
    public ResponseEntity<Set<Integer>> updateUserSavedPosts(
            @RequestParam("user_id") int userId,
            @RequestParam("location_id") int locationId,
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
            @RequestParam("follower_id") int followerId,
            @RequestParam("followee_id") int followeeId,
            @RequestParam("action") String action) {
        Optional<UserDTO> updatedUser = userService.updateUser(followerId, followeeId, action);
        Set<Integer> following = updatedUser
                .map(UserDTO::getFollowing)
                .orElse(Collections.emptySet());
        return ResponseEntity.ok(following);
    }

    @PatchMapping("/{user_id}/change-location")
    public ResponseEntity<?> changedLocation(
            @PathVariable("user_id") int userId,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam("city") String city) {

        try {
            userService.updateUserLocation(userId, latitude, longitude, city);
            return ResponseEntity.ok().build(); // 200 OK - Successful update
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // 400 Bad Request
        } catch (Exception e) { // Catch other exceptions (e.g., database errors)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 Internal Server Error
        }
    }

    @PutMapping("/{user_id}")
    public ResponseEntity<User> updateUser(@PathVariable("user_id") int userId, @RequestBody User userUpdates) {
        Optional<User> updatedUser = userService.updateUser(userId, userUpdates, false);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{user_id}/names")
    public ResponseEntity<?> updateUserFields(
            @PathVariable("user_id") int userId,
            @RequestParam(value = "new_name", required = false) String newName,
            @RequestParam(value = "new_username", required = false) String newUsername) {

        Map<String, String> errors = userService.validateAndUpdateUser(userId, newName, newUsername, true);

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors); // Return validation errors
        }

        return userService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{user_id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("user_id") int userId) {
        if (userService.deleteUser(userId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping(value = "/{user_id}/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDTO> updateUserFields(@PathVariable(value = "user_id") int userId,
                                                    @RequestParam(value = "new_bio", required = false) String bio,
                                                    @RequestPart(value = "new_image", required = false) MultipartFile image) {
        Optional<UserDTO> updatedUser = userService.updateUser(userId, bio, image, true);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

package com.ShareWhere.ShareWhere.controllers;

import com.ShareWhere.ShareWhere.DTOs.UserDTO;
import com.ShareWhere.ShareWhere.DTOs.UserProfileDTO;
import com.ShareWhere.ShareWhere.models.User;
import com.ShareWhere.ShareWhere.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    // Constructor Injection
    public UserController(UserService userService) {
        this.userService = userService;
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
        System.out.println("Getting user with ID: " + userId);
        return userService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

//    @PostMapping("/product")
//    public ResponseEntity<?> createUserWithPic(@RequestBody User user, @RequestPart MultipartFile profilePicFile) {
//        try {
//            User userWithPic = userService.addUser(user, profilePicFile);
//        }
//        catch(Exception e) {
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

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

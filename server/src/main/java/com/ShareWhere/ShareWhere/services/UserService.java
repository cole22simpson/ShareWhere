package com.ShareWhere.ShareWhere.services;

import com.ShareWhere.ShareWhere.DTOs.*;
import com.ShareWhere.ShareWhere.models.Image;
import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.models.User;
import com.ShareWhere.ShareWhere.models.UserProfile;
import com.ShareWhere.ShareWhere.repositories.LocationRepo;
import com.ShareWhere.ShareWhere.repositories.UserRepo;
import com.ShareWhere.ShareWhere.utils.FileUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final LocationRepo locationRepo;
    private final FileUtils fileUtils;
    private final AzureBlobStorageService azureBlobStorageService;

    // Constructor Injection
    public UserService(UserRepo userRepo, LocationRepo locationRepo, FileUtils fileUtils, AzureBlobStorageService azureBlobStorageService) {
        this.userRepo = userRepo;
        this.locationRepo = locationRepo;
        this.fileUtils = fileUtils;
        this.azureBlobStorageService = azureBlobStorageService;
    }

    public List<UserDTO> getAllUsers() {
        return userRepo.findAll().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public User createUser(User user) {
        try {
            String defaultProfilePicUrl = fileUtils.loadDefaultProfilePicture();
            Image defaultProfilePic = new Image(
                    "default_profile_pic.png",
                    "image/png",
                    defaultProfilePicUrl
            );
            UserProfile profile = new UserProfile(user);
            profile.setProfilePic(defaultProfilePic);
            defaultProfilePic.setUserProfile(profile);
            user.setProfile(profile);
            return userRepo.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create User or UserProfile", e);
        }
    }

    public Optional<UserDTO> getUserById(int userId) {
        return userRepo.findById(userId)
                .map(UserDTO::new);
    }

    public List<LocationPreviewDTO> getUserPosts(int userId) {
        UserProfile profile = this.getUserProfileById(userId).orElseThrow(
                () -> new EntityNotFoundException("User not found")
        );
        List<LocationPreviewDTO> posts = new ArrayList<>();
        for (Location post : profile.getUserPosts()) {
            posts.add(new LocationPreviewDTO(post));
        }
        return posts;
    }

    public List<LocationPreviewDTO> getUserSavedPosts(int userId) {
        UserProfile profile = this.getUserProfileById(userId).orElseThrow(
                () -> new EntityNotFoundException("User not found")
        );
        List<LocationPreviewDTO> saved = new ArrayList<>();
        for (Location save : profile.getSavedLocations()) {
            saved.add(new LocationPreviewDTO(save));
        }
        return saved;
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return userRepo.existsByEmail(email);
    }

    // The transactional annotation signifies that the entire transaction must be completed in order to execute
    // If something goes wrong in the middle, everything will be rolled back.
    // This code formatting below is the lambda expression setup. Lambda uses functional programming.
    // This setup is calle optional chaining. The optional Object can be null.
    // Optional.map() ensures the code executes only if the value (User) exsists, preventing a NullPointerException
    @Transactional
    public Optional<User> updateUser(int userId, User updatedFields, boolean isPartial) {
        return userRepo.findById(userId).map(existingUser -> { // Fetch user, get Optional<User>. The map says if user is found, map it
            if (updatedFields.getUsername() != null || !isPartial) {
                existingUser.setUsername(updatedFields.getUsername());
            }
            if (updatedFields.getEmail() != null || !isPartial) {
                existingUser.setEmail(updatedFields.getEmail());
            }
            if (updatedFields.getPasswordHash() != null || !isPartial) {
                existingUser.setPasswordHash(updatedFields.getPasswordHash());
            }

            return userRepo.save(existingUser);
        });
    }

    @Transactional
    public Optional<UserDTO> updateUser(int userId, String newName, String newUsername, boolean isPartial) {
        return userRepo.findById(userId).map(existingUser -> { // Fetch user, get Optional<User>. The map says if user is found, map it
            if (newName != null || !isPartial) {
                existingUser.setName(newName);
            }
            if (newUsername != null || !isPartial) {
                existingUser.setUsername(newUsername);
            }

            existingUser.getProfile().setUpdatedAt(LocalDateTime.now());

            userRepo.save(existingUser);

            return new UserDTO(existingUser);
        });
    }

    @Transactional
    public Optional<LocationDTO> updateUser(int userId, Location location, String field) {
        return userRepo.findById(userId).map(existingUser -> {
            UserProfile profile = existingUser.getProfile();

            if (field.equals("SAVE")) {
                synchronized (location) {
                    List<Location> saved = profile.getSavedLocations();
                    if (!saved.contains(location)) {
                        saved.add(location);
                        profile.setSavedLocations(saved);
                        location.setSaves(location.getSaves() + 1);
                        Set<UserProfile> savedBy = location.getSavedBy();
                        savedBy.add(profile);
                        location.setSavedBy(savedBy);
                    }
                }
            }
            else if (field.equals("UNSAVE")) {
                synchronized (location) {
                    List<Location> saved = profile.getSavedLocations();
                    if (saved.contains(location)) {
                        saved.remove(location);
                        profile.setSavedLocations(saved);
                        location.setSaves(location.getSaves() - 1);
                        Set<UserProfile> savedBy = location.getSavedBy();
                        savedBy.remove(profile);
                        location.setSavedBy(savedBy);
                    }
                }
            }
            locationRepo.save(location);
            userRepo.save(existingUser);
            return new LocationDTO(location);
        });
    }

    public boolean deleteUser(int userId) {
        if (userRepo.existsById(userId)) {
            userRepo.deleteById(userId);
            return true;
        }
        return false;
    }

    public Optional<UserProfileDTO> getUserProfileDTOById(int userId) {
        return userRepo.findById(userId)
                .map(User::getProfile)
                .map(UserProfileDTO::new);
    }

    public Optional<UserProfile> getUserProfileById(int userId) {
        return userRepo.findById(userId)
                .map(User::getProfile);
    }

    @Transactional
    public Optional<UserDTO> updateUser(int userId, String bio, MultipartFile image, boolean isPartial) {
        return userRepo.findById(userId).map(existingUser -> { // Fetch user, get Optional<User>. The map says if user is found, map it
            if (image != null || !isPartial) {
                try {
                    assert image != null;
                    String imageUrl = azureBlobStorageService.uploadFile(image);
                    Image newImage = new Image(
                            image.getOriginalFilename(),
                            image.getContentType(),
                            imageUrl
                    );
                    existingUser.getProfile().setProfilePic(newImage);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            if (bio != null || !isPartial) {
                existingUser.getProfile().setBio(bio);
            }

            existingUser.setUpdatedAt(LocalDateTime.now());

            userRepo.save(existingUser);
            return new UserDTO(existingUser);
        });
    }
}

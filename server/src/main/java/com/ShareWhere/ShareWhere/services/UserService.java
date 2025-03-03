package com.ShareWhere.ShareWhere.services;

import com.ShareWhere.ShareWhere.DTOs.*;
import com.ShareWhere.ShareWhere.models.*;
import com.ShareWhere.ShareWhere.repositories.LocationRepo;
import com.ShareWhere.ShareWhere.repositories.UserRepo;
import com.ShareWhere.ShareWhere.utils.FileUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
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

    public List<HomeSearchResultDTO> getAllUsernames(String query) {
        List<User> users = userRepo.findAll();
        List<HomeSearchResultDTO> filteredUsers = new ArrayList<>();
        for (User user : users) {
            if (user.getUsername().toLowerCase().contains(query.toLowerCase()) ||
                    user.getName().toLowerCase().contains(query.toLowerCase())) {

                filteredUsers.add(new HomeSearchResultDTO(
                        user.getUsername(), user.getName(),
                        user.getUserId(),
                        user.getProfile().getProfilePic().getImageUrl(),
                        "USER"

                ));
            }
        }
        return filteredUsers;
    };

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

    public HomeUserDTO getFollowingPosts(int userId) {
        return userRepo.findById(userId).map(follower -> {
            List<HomeLocationDTO> followingPosts = new ArrayList<>();

            for (User following : follower.getFollowing()) {
                List<Location> userPosts = following.getProfile().getUserPosts();
                for (Location post : userPosts) {
                    followingPosts.add(new HomeLocationDTO(post));
                }
            }

            followingPosts.sort(Comparator.comparing(HomeLocationDTO::getCreatedAt).reversed());

            HomeUserDTO homeUserDTO = new HomeUserDTO(follower);
            homeUserDTO.setFollowingPosts(followingPosts.stream()
                    .limit(8)
                    .collect(Collectors.toList()));

            return homeUserDTO;  // Return the single HomeUserDTO
        }).orElse(null);  // Return null if user is not found
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

    public boolean existsByUsername(String username) {
        return userRepo.existsByUsername(username);
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
    public Map<String, String> validateAndUpdateUser(int userId, String newName, String newUsername, boolean isPartial) {
        Map<String, String> errors = new HashMap<>();

        Optional<User> optionalUser = userRepo.findById(userId);
        if (optionalUser.isEmpty()) {
            errors.put("user", "User not found.");
            return errors;
        }

        User existingUser = optionalUser.get();

        // Validate newName
        if (newName != null || !isPartial) {
            if (newName == null || newName.length() < 3 || newName.length() > 30) {
                errors.put("name", "Name must be between 3 and 30 characters.");
            }
        }

        // Validate newUsername
        if (newUsername != null || !isPartial) {
            if (newUsername == null || newUsername.length() < 3 || newUsername.length() > 30) {
                errors.put("username", "Username must be between 3 and 30 characters.");
            } else {
                // Regex check for valid characters
                String usernameRegex = "^[A-Za-z0-9_.]+$";
                if (!Pattern.matches(usernameRegex, newUsername)) {
                    errors.put("username", "Username can only contain letters, numbers, underscores, and periods.");
                }

                // **Check if username is already taken, but only if it's different from the existing one**
                if (!newUsername.equals(existingUser.getUsername()) && userRepo.existsByUsername(newUsername)) {
                    errors.put("username", "Username is already taken.");
                }
            }
        }

        // If there are validation errors, return them
        if (!errors.isEmpty()) {
            return errors;
        }

        // Proceed with updating the user if no validation errors exist
        if (newName != null || !isPartial) {
            existingUser.setName(newName);
        }
        if (newUsername != null || !isPartial) {
            existingUser.setUsername(newUsername);
        }

        existingUser.getProfile().setUpdatedAt(LocalDateTime.now());
        userRepo.save(existingUser);

        return Collections.emptyMap(); // No errors, return an empty map
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

    @Transactional
    public Optional<UserDTO> updateUser(int followerId, int followeeId, String action) {
        return userRepo.findById(followerId).map(follower -> {
            User followee = userRepo.findById(followeeId).orElseThrow(
                    () -> new EntityNotFoundException("User not found")
            );
            Set<User> followerFollowing = follower.getFollowing();
            Set<User> followeeFollowers = followee.getFollowers();
            if (action.equals("FOLLOW")) {
                if (!followerFollowing.contains(followee)) {
                    followerFollowing.add(followee);
                    follower.setFollowing(followerFollowing);
                    followeeFollowers.add(follower);
                    followee.setFollowers(followeeFollowers);
                }
            }
            else if (action.equals("UNFOLLOW")) {
                if (followerFollowing.contains(followee)) {
                    followerFollowing.remove(followee);
                    follower.setFollowing(followerFollowing);
                    followeeFollowers.remove(follower);
                    followee.setFollowers(followeeFollowers);
                }
            }
            userRepo.save(follower);
            userRepo.save(followee);
            return new UserDTO(follower);
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
    public void updateUserLocation(int userId, Double latitude, Double longitude, String city) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Validate inputs (optional, but highly recommended)
        if (latitude == null || longitude == null || city == null || city.isEmpty()) {
            throw new IllegalArgumentException("Latitude, longitude, and city are required.");
        }

        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("Invalid latitude. Must be between -90 and 90.");
        }

        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("Invalid longitude. Must be between -180 and 180.");
        }

        user.setLatitude(latitude);
        user.setLongitude(longitude);
        user.setCity(city);

        userRepo.save(user);
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

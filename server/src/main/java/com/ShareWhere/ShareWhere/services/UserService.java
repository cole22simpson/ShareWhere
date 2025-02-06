package com.ShareWhere.ShareWhere.services;

import com.ShareWhere.ShareWhere.DTOs.ImageDTO;
import com.ShareWhere.ShareWhere.DTOs.UserDTO;
import com.ShareWhere.ShareWhere.DTOs.UserProfileDTO;
import com.ShareWhere.ShareWhere.models.Image;
import com.ShareWhere.ShareWhere.models.User;
import com.ShareWhere.ShareWhere.models.UserProfile;
import com.ShareWhere.ShareWhere.repositories.UserRepo;
import com.ShareWhere.ShareWhere.utils.FileUtils;
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
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepo userRepo;

    // Constructor Injection
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public List<UserDTO> getAllUsers() {
        return userRepo.findAll().stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public User createUser(User user) {
        try {
            byte[] defaultProfilePicData = FileUtils.loadDefaultProfilePicture();
            Image defaultProfilePic = new Image(
                    "default_profile_pic.png",
                    "image/png",
                    defaultProfilePicData
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
                    Image newImage = new Image(
                            image.getOriginalFilename(),
                            image.getContentType(),
                            image.getBytes()
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

package com.ShareWhere.ShareWhere.services;

import com.ShareWhere.ShareWhere.models.User;
import com.ShareWhere.ShareWhere.models.UserProfile;
import com.ShareWhere.ShareWhere.repositories.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepo userRepo;

    // Constructor Injection
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Transactional
    public User createUser(User user) {
        try {
            user.setProfile(new UserProfile(user));
            return userRepo.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create User or UserProfile", e);
        }
    }
//    public User createUserWithPic(User user, MultipartFile profilePic) throws IOException {
//        user.setProfilePicName(profilePic.getOriginalFilename());
//        user.setProfilePicImgType(profilePic.getContentType());
//        user.setImageData(profilePic.getBytes());
//        return userRepo.save(user);
//    }

    public Optional<User> getUserById(int userId) {
        return userRepo.findById(userId);
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

    public boolean deleteUser(int userId) {
        if (userRepo.existsById(userId)) {
            userRepo.deleteById(userId);
            return true;
        }
        return false;
    }
}

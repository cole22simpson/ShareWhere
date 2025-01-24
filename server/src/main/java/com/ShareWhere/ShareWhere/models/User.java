package com.ShareWhere.ShareWhere.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userID;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false, name = "password")
    private String passwordHash;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String role;

    @OneToOne(
            cascade = CascadeType.ALL,
            mappedBy = "user",
            orphanRemoval = true
    )
    private UserProfile profile;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

//    private String status;
//    private String role;
//    private LocalDateTime lastLogin;



    // When it comes to constructors, you want to make constructors call other constructors in order to simplify
    // the code. If you pass in 3 variables to a constructor, you should call the explicitly defined constructor
    // with those three variables and three other default arguments in the function call.
    // this() will call a constructor in that class, so if you call a constructor using this()
    // with the three arguments passed in, then it will become an infinite loop.

    // Constructors
    protected User() {}

    public User(String email, String password, String username, String name, String location) {
        this(email, password, username, name, location, "User");
    }

    public User(String email, String password, String username, String name, String location, String role) {
        this.username = validateNotEmpty(username, "Username");
        this.email = validateNotEmpty(email, "Email");
        this.passwordHash = validateNotEmpty(password, "Password");
        this.name = validateNotEmpty(name, "Name");
        this.location = validateNotEmpty(location, "Location");
        this.role = validateNotEmpty(role, "Role");
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    private static String validateNotEmpty(String value, String fieldName) {
        if (value == null || value.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " cannot be null or empty");
        }
        return value;
    }
//
//    public void setPassword(String password) {
//        this.passwordHash = hashPassword(password);
//    }
//
//    private String hashPassword(String password) {
//        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
//        return encoder.encode(password);
//    }

//    public void setProfile(UserProfile profile) {
//        this.profile = profile;
//        if (profile != null) {
//            profile.setUser(this);
//        }
//    }
}

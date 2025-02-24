package com.ShareWhere.ShareWhere.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    @Column(unique = true, nullable = false, length = 30)
    private String username;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false, name = "password")
    private String passwordHash;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String role;

    @OneToOne(
            cascade = CascadeType.ALL,
            mappedBy = "user",
            orphanRemoval = true
    )
    @JsonIgnore
    private UserProfile profile;

    @ManyToMany
    @JoinTable(
            name = "user_followers",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    private Set<User> followers = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "user_following",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    private Set<User> following = new HashSet<>();

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
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

    public User(String email, String password, String username, String name, Double latitude, Double longitude, String city) {
        this(email, password, username, name, latitude, longitude, city, "User");
    }

    public User(String email, String password, String username, String name, Double latitude, Double longitude, String city, String role) {
        this.username = validateNotEmptyString(username, "Username").toLowerCase();
        this.email = validateNotEmptyString(email, "Email");
        this.passwordHash = validateNotEmptyString(password, "Password");
        this.name = validateNotEmptyString(name, "Name");
        this.latitude = validateNotEmptyDouble(latitude, "Latitude");
        this.longitude = validateNotEmptyDouble(longitude, "Longitude");
        this.city = validateNotEmptyString(city, "City");
        this.role = validateNotEmptyString(role, "Role");
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

    private static String validateNotEmptyString(String value, String fieldName) {
        if (value == null || value.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " cannot be null or empty");
        }
        return value;
    }

    private static Double validateNotEmptyDouble(Double value, String fieldName) {
        if (value == null || value == 0.0) {
            throw new IllegalArgumentException(fieldName + " cannot be null or empty");
        }
        return value;
    }

    public boolean equals(User user) {
        return this.userId == user.getUserId();
    }

    public int hashCode() {
        return Objects.hash(userId);
    }
}

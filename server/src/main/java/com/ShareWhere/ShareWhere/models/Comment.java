package com.ShareWhere.ShareWhere.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Data
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int commentId;

    @Column(nullable = false, length = 800)
    private String commentText;

    @ManyToOne
    @JoinColumn(name = "location_id")
    @JsonIgnore
    private Location location;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    @JsonIgnore
    private UserProfile writtenBy;

    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Image> images;

    @Column(nullable = false)
    private Integer likes = 0;

    @ElementCollection
    private Set<Integer> likedBy = new HashSet<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime timeCreated = LocalDateTime.now();

    public Comment() {}

    public Comment(String commentText, UserProfile writtenBy, Location location) {
        this.commentText = commentText;
        this.writtenBy = writtenBy;
        this.location = location;
    }

    public boolean equals(Comment comment) {
        return this.commentId == comment.getCommentId();
    }

    public int hashCode() {
        return Objects.hash(commentId);
    }
}

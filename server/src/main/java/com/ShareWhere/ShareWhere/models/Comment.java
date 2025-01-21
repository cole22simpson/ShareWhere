package com.ShareWhere.ShareWhere.models;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int commentId;

    @Column(nullable = false)
    private int userId;

    @Column(nullable = false)
    private int locationId;

    public String commentText;

    @ManyToMany
    @JoinTable(
            name = "comment_tags",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    @Column(nullable = false)
    private Integer likes = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timeCreated = LocalDateTime.now();;

    public Comment() {}

    public Comment(int userId, int locationId, String commentText) {
        this.userId = userId;
        this.locationId = locationId;
        this.commentText = commentText;
    }

    public Comment(int userId, int locationId, String commentText, List<Tag> tags) {
        this.userId = userId;
        this.locationId = locationId;
        this.commentText = commentText;
        this.tags.addAll(tags);
    }
}

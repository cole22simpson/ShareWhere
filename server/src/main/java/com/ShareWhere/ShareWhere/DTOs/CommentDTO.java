package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.*;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class CommentDTO {
    private int commentId;
    private String commentText;
    private int locationId;
    private String commenterUser;
    private ImageDTO commenterProfilePic;
    private List<ImageDTO> images = new ArrayList<>();
    private Set<Integer> likedBy = new HashSet<>();
    private int likes;
    private LocalDateTime timeCreated;

    public CommentDTO(Comment comment) {
        this.commentId = comment.getCommentId();
        this.commentText = comment.getCommentText();
        this.locationId = comment.getLocation().getLocationId();
        this.commenterUser = comment.getWrittenBy().getUser().getUsername();
        for (Image image : comment.getImages()) {
            this.images.add(new ImageDTO(image));
        }
        this.likes = comment.getLikes();
        this.likedBy.addAll(comment.getLikedBy());
        this.timeCreated = comment.getTimeCreated();
        this.commenterProfilePic = new ImageDTO(comment.getWrittenBy().getProfilePic());
    }
}

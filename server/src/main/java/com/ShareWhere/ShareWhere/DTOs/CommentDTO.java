package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.Comment;
import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.models.User;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private int commentId;
    private String commentText;
    private int locationId;
    private String commenterUser;
    private ImageDTO commenterProfilePic;
    private int likes;
    private LocalDateTime timeCreated;

    public CommentDTO(Comment comment) {
        this.commentId = comment.getCommentId();
        this.commentText = comment.getCommentText();
        this.locationId = comment.getLocation().getLocationId();
        this.commenterUser = comment.getWrittenBy().getUser().getUsername();
        this.likes = comment.getLikes();
        this.timeCreated = comment.getTimeCreated();
        this.commenterProfilePic = new ImageDTO(comment.getWrittenBy().getProfilePic());
    }
}

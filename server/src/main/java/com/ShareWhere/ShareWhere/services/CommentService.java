package com.ShareWhere.ShareWhere.services;

import com.ShareWhere.ShareWhere.DTOs.CommentDTO;
import com.ShareWhere.ShareWhere.DTOs.ImageDTO;
import com.ShareWhere.ShareWhere.models.Comment;
import com.ShareWhere.ShareWhere.models.Image;
import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.models.UserProfile;
import com.ShareWhere.ShareWhere.repositories.CommentRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepo commentRepo;
    private final LocationService locationService;
    private final UserService userService;

    public CommentService(CommentRepo commentRepo, LocationService locationService, UserService userService) {
        this.commentRepo = commentRepo;
        this.locationService = locationService;
        this.userService = userService;
    }

    public List<Comment> getAllComments() {
        return commentRepo.findAll();
    }

    public CommentDTO createComment(
            Integer locationId, Integer userId, String commentText, List<MultipartFile> imageFiles) throws IOException {

        Location location = locationService.getLocationById(locationId).orElseThrow(
                () -> new EntityNotFoundException("Location not found")
        );

        UserProfile profile = userService.getUserProfileById(userId).orElseThrow(
                () -> new EntityNotFoundException("User profile not found")
        );

        Comment comment = new Comment(commentText, profile, location);

        List<Image> images = new ArrayList<>();
        if (imageFiles != null) {
            for (MultipartFile imageFile : imageFiles) {
                Image image = new Image(
                        imageFile.getOriginalFilename(),
                        imageFile.getContentType(),
                        imageFile.getBytes()
                );
                image.setComment(comment);
                images.add(image);
            }
        }
        comment.setImages(images);

        location.getComments().add(comment);
        profile.getUserComments().add(comment);

        commentRepo.save(comment);

        return new CommentDTO(comment);
    }

    public Optional<Comment> getCommentById(int commentId) {
        return commentRepo.findById(commentId);
    }

    public Optional<Comment> updateComment(int commentId, Comment updatedFields, boolean isPartial) {
        return commentRepo.findById(commentId).map(existingComment -> {
            if (updatedFields.getCommentText() != null || !isPartial) {
                existingComment.setCommentText(updatedFields.getCommentText());
            }
            if (updatedFields.getLikes() != null || !isPartial) {
                existingComment.setLikes(updatedFields.getLikes());
            }

            commentRepo.save(existingComment);

            return existingComment;
        });
    }

    public boolean deleteComment(int commentId) {
        if (commentRepo.existsById(commentId)) {
            commentRepo.deleteById(commentId);
            return true;
        }
        return false;
    }
}

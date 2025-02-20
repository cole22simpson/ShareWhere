package com.ShareWhere.ShareWhere.services;

import com.ShareWhere.ShareWhere.DTOs.CommentDTO;
import com.ShareWhere.ShareWhere.DTOs.ImageDTO;
import com.ShareWhere.ShareWhere.DTOs.LocationDTO;
import com.ShareWhere.ShareWhere.models.Comment;
import com.ShareWhere.ShareWhere.models.Image;
import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.models.UserProfile;
import com.ShareWhere.ShareWhere.repositories.CommentRepo;
import com.ShareWhere.ShareWhere.repositories.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class CommentService {

    private final CommentRepo commentRepo;
    private final UserRepo userRepo;
    private final LocationService locationService;
    private final UserService userService;
    private final AzureBlobStorageService azureBlobStorageService;

    public CommentService(CommentRepo commentRepo, LocationService locationService, UserService userService, UserRepo userRepo, AzureBlobStorageService azureBlobStorageService) {
        this.commentRepo = commentRepo;
        this.locationService = locationService;
        this.userService = userService;
        this.userRepo = userRepo;
        this.azureBlobStorageService = azureBlobStorageService;
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
                String imageUrl = azureBlobStorageService.uploadFile(imageFile);
                Image image = new Image(
                        imageFile.getOriginalFilename(),
                        imageFile.getContentType(),
                        imageUrl
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

    @Transactional
    public CommentDTO updateComment(int userId, Comment comment, String field) {
        Set<Integer> likedBy = comment.getLikedBy();
        if (field.equals("LIKE")) {
            synchronized (comment) {
                if (!likedBy.contains(userId)) {
                    likedBy.add(userId);
                    comment.setLikes(comment.getLikes() + 1);
                }
            }
        }
        else if (field.equals("UNLIKE")) {
            synchronized (comment) {
                if (likedBy.contains(userId)) {
                    likedBy.remove(userId);
                    comment.setLikes(comment.getLikes() - 1);
                }
            }
        }
        commentRepo.save(comment);
        return new CommentDTO(comment);
    }

    public boolean deleteComment(int commentId) {
        if (commentRepo.existsById(commentId)) {
            commentRepo.deleteById(commentId);
            return true;
        }
        return false;
    }
}

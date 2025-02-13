package com.ShareWhere.ShareWhere.controllers;

import com.ShareWhere.ShareWhere.DTOs.CommentDTO;
import com.ShareWhere.ShareWhere.DTOs.LocationDTO;
import com.ShareWhere.ShareWhere.models.Comment;
import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.services.CommentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getAllComments() {
        List<Comment> comments = commentService.getAllComments();
        return ResponseEntity.ok(comments);
    }

    @PostMapping(value = "/send", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CommentDTO> createComment(
            @RequestParam("locationId") Integer locationId,
            @RequestParam("userId") Integer userId,
            @RequestParam("commentText") String commentText,
            @RequestPart(value = "imageFiles", required = false) List<MultipartFile> imageFiles) throws IOException {
        CommentDTO newComment = commentService.createComment(
                locationId, userId, commentText, imageFiles
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(newComment);
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<Comment> getCommentById(@PathVariable("commentId") int commentId) {
        return commentService.getCommentById(commentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable("commentId") int commentId, @RequestBody Comment updatedFields) {
        Optional<Comment> updatedComment = commentService.updateComment(commentId, updatedFields, false);
        return updatedComment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{commentId}")
    public ResponseEntity<Comment> updateCommentFields(@PathVariable("commentId") int commentId, @RequestBody Comment updatedFields) {
        Optional<Comment> updatedComment = commentService.updateComment(commentId, updatedFields, true);
        return updatedComment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/like")
    public ResponseEntity<Set<Integer>> updateUserSavedPosts(
            @RequestParam("userId") int userId,
            @RequestParam("commentId") int commentId,
            @RequestParam("field") String field) {
        Comment comment = commentService.getCommentById(commentId).orElseThrow(
                () -> new EntityNotFoundException("Comment not found")
        );
        CommentDTO updatedComment = commentService.updateComment(userId, comment, field);
        Set<Integer> likedBy = updatedComment.getLikedBy();

        return ResponseEntity.ok(likedBy);
    }
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Comment> deleteComment(@PathVariable("commentId") int commentId) {
        if (commentService.deleteComment(commentId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

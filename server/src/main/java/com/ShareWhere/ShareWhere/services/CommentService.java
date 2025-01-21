package com.ShareWhere.ShareWhere.services;

import com.ShareWhere.ShareWhere.models.Comment;
import com.ShareWhere.ShareWhere.repositories.CommentRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepo commentRepo;

    public CommentService(CommentRepo commentRepo) {
        this.commentRepo = commentRepo;
    }

    public List<Comment> getAllComments() {
        return commentRepo.findAll();
    }

    public Comment createComment(Comment comment) {
        return commentRepo.save(comment);
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
            if (updatedFields.getTags() != null || !isPartial) {
                existingComment.setTags(updatedFields.getTags());
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

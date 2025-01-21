package com.ShareWhere.ShareWhere.repositories;

import com.ShareWhere.ShareWhere.models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepo extends JpaRepository<Comment, Integer> {
}

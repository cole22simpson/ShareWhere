package com.ShareWhere.ShareWhere.repositories;

import com.ShareWhere.ShareWhere.models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepo extends JpaRepository<Tag, Integer> {
}

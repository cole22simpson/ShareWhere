package com.ShareWhere.ShareWhere.repositories;

import com.ShareWhere.ShareWhere.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepo extends JpaRepository<Location, Integer> {
}

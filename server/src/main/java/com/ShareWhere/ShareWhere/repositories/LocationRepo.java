package com.ShareWhere.ShareWhere.repositories;

import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepo extends JpaRepository<Location, Integer> {
    Optional<Location> findByLocationId(int locationId);
}

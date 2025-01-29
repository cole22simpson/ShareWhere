package com.ShareWhere.ShareWhere.services;

import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.repositories.LocationRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class LocationService {

    private final LocationRepo locationRepo;

    public LocationService(LocationRepo locationRepo) {
        this.locationRepo = locationRepo;
    }

    public List<Location> getAllLocations() {
        return locationRepo.findAll();
    }

    public Location createLocation(Location location) {
        return locationRepo.save(location);
    }

    public Optional<Location> getLocationById(int locationId) {
        return locationRepo.findById(locationId);
    }

    @Transactional
    public Optional<Location> updateLocation(int locationId, Location location, boolean isPartial) {
        return locationRepo.findById(locationId).map(existingLocation -> {
            if (location.getLocationName() != null || !isPartial) {
                existingLocation.setLocationName(location.getLocationName());
            }
            if (location.getLocationDescription() != null || !isPartial) {
                existingLocation.setLocationDescription(location.getLocationDescription());
            }
            if (location.getLatitude() != null || !isPartial) {
                existingLocation.setLatitude(location.getLatitude());
            }
            if (location.getLongitude() != null || !isPartial) {
                existingLocation.setLongitude(location.getLongitude());
            }

            return locationRepo.save(existingLocation);
        });
    }

    public boolean deleteLocation(int locationId) {
        if (locationRepo.existsById(locationId)) {
            locationRepo.deleteById(locationId);
            return true;
        }
        return false;
    }
}

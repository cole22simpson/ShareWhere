package com.ShareWhere.ShareWhere.controllers;

import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/locations")
public class LocationController {

    private final LocationService locationService;

    // Constructor Injection
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public ResponseEntity<List<Location>> getLocations() {
        List<Location> locations = locationService.getAllLocations();
        return ResponseEntity.ok(locations);
    }

    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
        Location newLocation = locationService.createLocation(location);
        return ResponseEntity.status(HttpStatus.CREATED).body(newLocation);
    }

    @GetMapping("/{locationId}")
    public ResponseEntity<Location> getLocationById(@PathVariable int locationId) {
        return locationService.getLocationById(locationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{locationId}")
    public ResponseEntity<Location> updateLocation(@PathVariable("locationId") int locationId, @RequestBody Location locationUpdates) {
        Optional<Location> updatedLocation = locationService.updateLocation(locationId, locationUpdates, false);
        return updatedLocation.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{locationId}")
    public ResponseEntity<Location> updateLocationFields(@PathVariable("locationId") int locationId, @RequestBody Location locationUpdates) {
        Optional<Location> updatedLocation = locationService.updateLocation(locationId, locationUpdates, true);
        return updatedLocation.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/locations/{locationId}")
    public ResponseEntity<Location> deleteUser(@PathVariable("locationId") int locationId) {
        if (locationService.deleteLocation(locationId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

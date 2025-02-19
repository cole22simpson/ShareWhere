package com.ShareWhere.ShareWhere.controllers;

import com.ShareWhere.ShareWhere.DTOs.LocationDTO;
import com.ShareWhere.ShareWhere.DTOs.LocationPreviewDTO;
import com.ShareWhere.ShareWhere.models.Image;
import com.ShareWhere.ShareWhere.models.Location;
//import com.ShareWhere.ShareWhere.models.LocationRequest;
import com.ShareWhere.ShareWhere.models.Tag;
import com.ShareWhere.ShareWhere.services.LocationService;
import com.ShareWhere.ShareWhere.services.TagService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.awt.*;
import java.io.IOException;
import java.sql.SQLOutput;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/locations")
public class LocationController {

    private final LocationService locationService;
    private final TagService tagService;

    // Constructor Injection
    public LocationController(LocationService locationService, TagService tagService) {
        this.locationService = locationService;
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<LocationDTO>> getLocations() {
        List<LocationDTO> locations = locationService.getAllLocations();
        return ResponseEntity.ok(locations);
    }

    @PostMapping
    public ResponseEntity<Location> createLocation(@RequestBody Location location) {
        Location newLocation = locationService.createLocation(location);
        return ResponseEntity.status(HttpStatus.CREATED).body(newLocation);
    }

    @PostMapping(value = "/post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createLocation(
            @RequestParam(value = "userId") String userId,
            @RequestParam(value = "locationName") String locationName,
            @RequestParam(value = "locationDescription") String locationDescription,
            @RequestParam(value = "latitude") String latitude,
            @RequestParam(value = "longitude") String longitude,
            @RequestParam(value = "pinType") String pinType,
            @RequestParam(value = "tagNames") String tagNames,
            @RequestPart(value = "imageFiles") List<MultipartFile> imageFiles) throws IOException {

        Double latitudeDouble;
        Double longitudeDouble;
        try {
            double latitudedouble = Double.parseDouble(latitude);
            double longitudedouble = Double.parseDouble(longitude);

            latitudeDouble = latitudedouble;
            longitudeDouble = longitudedouble;

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid latitude or longitude format");
        }

        tagNames = tagNames.replaceAll("-", " ");
        List<String> tagNamesList = Arrays.asList(tagNames.split(","));

        int intUserId = Integer.parseInt(userId);
        System.out.println("Id: " + intUserId);

        Location location = locationService.createLocation(
                intUserId, locationName, locationDescription, latitudeDouble, longitudeDouble, pinType, tagNamesList, imageFiles
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(new LocationDTO(location));
    }

    @GetMapping("/{locationId}")
    public ResponseEntity<LocationDTO> getLocationById(@PathVariable int locationId) {
        return locationService.getLocationDTOById(locationId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/pins")
    public ResponseEntity<List<LocationPreviewDTO>> getLocationsOnMap(
            @RequestParam(value = "north") Double north,
            @RequestParam(value = "south") Double south,
            @RequestParam(value = "east") Double east,
            @RequestParam(value = "west") Double west) {
        List<LocationPreviewDTO> locations = locationService.getLocationsOnMap(north, south, east, west);
        return ResponseEntity.ok(locations);
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

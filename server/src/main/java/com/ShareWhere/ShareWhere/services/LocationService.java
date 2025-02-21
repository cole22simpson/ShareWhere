package com.ShareWhere.ShareWhere.services;

import com.ShareWhere.ShareWhere.DTOs.LocationDTO;
import com.ShareWhere.ShareWhere.DTOs.LocationPreviewDTO;
import com.ShareWhere.ShareWhere.DTOs.UserDTO;
import com.ShareWhere.ShareWhere.DTOs.UserProfileDTO;
import com.ShareWhere.ShareWhere.models.Image;
import com.ShareWhere.ShareWhere.models.Location;
//import com.ShareWhere.ShareWhere.models.LocationRequest;
import com.ShareWhere.ShareWhere.models.Tag;
import com.ShareWhere.ShareWhere.models.UserProfile;
import com.ShareWhere.ShareWhere.repositories.LocationRepo;
import com.ShareWhere.ShareWhere.repositories.TagRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LocationService {

    private final LocationRepo locationRepo;
    private final TagRepo tagRepo;
    private final String uploadDir = "uploads/locations/";
    private final TagService tagService;
    private final UserService userService;
    private final AzureBlobStorageService azureBlobStorageService;

    public LocationService(LocationRepo locationRepo, TagRepo tagRepo, TagService tagService, UserService userService, AzureBlobStorageService azureBlobStorageService) {
        this.locationRepo = locationRepo;
        this.tagRepo = tagRepo;
        this.tagService = tagService;
        this.userService = userService;
        this.azureBlobStorageService = azureBlobStorageService;
    }

    public List<LocationDTO> getAllLocations() {
        return locationRepo.findAll().stream()
                .map(LocationDTO::new)
                .collect(Collectors.toList());
    }

    public List<LocationPreviewDTO> getAllLocationPreviews() {
        return locationRepo.findAll().stream()
                .map(LocationPreviewDTO::new)
                .collect(Collectors.toList());
    }

    public Location createLocation(Location location) {
        return locationRepo.save(location);
    }

    public Location createLocation(
            int userId, String locationName, String locationDescription,
            Double latitude, Double longitude, String city,
            String pinType, List<String> tagNames, List<MultipartFile> imageFiles
    ) throws IOException {

        Location location = new Location(
                locationName,
                locationDescription,
                latitude,
                longitude,
                city,
                pinType,
                tagService.getTagsByName(tagNames)
        );

        List<Image> images = new ArrayList<>();
        for (MultipartFile imageFile : imageFiles) {
            String imageUrl = azureBlobStorageService.uploadFile(imageFile);
            Image image = new Image(
                    imageFile.getOriginalFilename(),
                    imageFile.getContentType(),
                    imageUrl
            );
            image.setLocation(location);
            images.add(image);
        }
        location.setImages(images);

        UserProfile profile = userService.getUserProfileById(userId).orElseThrow(
                () -> new EntityNotFoundException("User profile not found")
        );
        location.setCreatedBy(profile);
        profile.getUserPosts().add(location);

        return locationRepo.save(location);
    }

    public Optional<Location> getLocationById(int locationId) {
        return locationRepo.findById(locationId);
    }

    public Optional<LocationDTO> getLocationDTOById(int locationId) {
        return locationRepo.findById(locationId)
                .map(LocationDTO::new);
    }

    public List<LocationPreviewDTO> getLocationsOnMap(Double north, Double south, Double east, Double west) {
        List<LocationPreviewDTO> locations = this.getAllLocationPreviews();

        List<LocationPreviewDTO> locationsOnMap = new ArrayList<>();
        for (LocationPreviewDTO location : locations) {
            if (location.getLatitude() > south && location.getLatitude() < north &&
                    location.getLongitude() > east && location.getLongitude() < west) {
                locationsOnMap.add(location);
            }
        }
        return locationsOnMap;
    };

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

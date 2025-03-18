package com.ShareWhere.ShareWhere.services;

import com.ShareWhere.ShareWhere.DTOs.*;
import com.ShareWhere.ShareWhere.models.*;
//import com.ShareWhere.ShareWhere.models.LocationRequest;
import com.ShareWhere.ShareWhere.repositories.LocationRepo;
import com.ShareWhere.ShareWhere.repositories.TagRepo;
import com.ShareWhere.ShareWhere.repositories.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LocationService {

    private final LocationRepo locationRepo;
    private final UserRepo userRepo;
    private final TagRepo tagRepo;
    private final String uploadDir = "uploads/locations/";
    private final TagService tagService;
    private final UserService userService;
    private final AzureBlobStorageService azureBlobStorageService;
    private final DataSourceTransactionManagerAutoConfiguration dataSourceTransactionManagerAutoConfiguration;

    public LocationService(LocationRepo locationRepo, TagRepo tagRepo, TagService tagService, UserRepo userRepo, UserService userService, AzureBlobStorageService azureBlobStorageService, DataSourceTransactionManagerAutoConfiguration dataSourceTransactionManagerAutoConfiguration) {
        this.locationRepo = locationRepo;
        this.tagRepo = tagRepo;
        this.tagService = tagService;
        this.userRepo = userRepo;
        this.userService = userService;
        this.azureBlobStorageService = azureBlobStorageService;
        this.dataSourceTransactionManagerAutoConfiguration = dataSourceTransactionManagerAutoConfiguration;
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

    public List<HomeLocationDTO> getAllHomeLocations() {
        return locationRepo.findAll().stream()
                .map(HomeLocationDTO::new)
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
        List<LocationPreviewDTO> locations = getAllLocationPreviews();
        List<LocationPreviewDTO> locationsOnMap = new ArrayList<>();

        for (LocationPreviewDTO location : locations) {
            if (withinBounds(location, north, south, east, west)) {
                locationsOnMap.add(location);
            }
        }
        return locationsOnMap;
    }

    public List<HomeLocationDTO> getHomePosts(Double north, Double south, Double east, Double west) {
        List<HomeLocationDTO> homePosts = new ArrayList<>(); // Initialize as an empty list
        List<HomeLocationDTO> allLocations = getAllHomeLocations(); // Get all locations

        for (HomeLocationDTO location : allLocations) {
            if (withinBounds(location, north, south, east, west)) {
                homePosts.add(location);
            }
        }

        homePosts.sort(Comparator.comparing(HomeLocationDTO::getSaves));

        return homePosts.stream()
                .limit(8)
                .collect(Collectors.toList());
    }

    public List<HomeSearchResultDTO> getAllLocationNames(String query) {
        List<Location> locations = locationRepo.findAll();
        List<HomeSearchResultDTO> filteredLocations = new ArrayList<>();
        for (Location location : locations) {
            if (location.getLocationName().toLowerCase().contains(query.toLowerCase())) {

                filteredLocations.add(new HomeSearchResultDTO(
                        location.getLocationName(), location.getLocationId(),
                        location.getImages().get(0).getImageUrl(),
                        "LOCATION", location.getCity()
                ));
            }
        }
        return filteredLocations;
    };

    public List<HomeLocationDTO> getHomePostsByType(Double north, Double south, Double east, Double west, int tagId) {
        List<HomeLocationDTO> homePosts = new ArrayList<>();
        List<HomeLocationDTO> allLocations = getAllHomeLocations();

        for (HomeLocationDTO location : allLocations) {
            if (withinBounds(location, north, south, east, west) &&
                    location.getTags().stream().anyMatch(tag -> tag.getTagId() == tagId)) {
                homePosts.add(location);
            }
        }

        homePosts.sort(Comparator.comparing(HomeLocationDTO::getSaves).reversed());

        return homePosts.stream()
                .limit(8)
                .collect(Collectors.toList());
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

    @Transactional
    public boolean deleteLocation(int locationId) {
        if (locationRepo.existsById(locationId)) {
            Location location = locationRepo.findById(locationId).orElseThrow();
            Set<Integer> savedBy = location.getSavedBy();
            for (Integer savedById : savedBy) {
                User user = userRepo.findById(savedById).orElseThrow();
                List<Location> saves = user.getProfile().getSavedLocations();
                saves.remove(location);
                user.getProfile().setSavedLocations(saves);
                userRepo.save(user);
            }
            locationRepo.deleteById(locationId);
            return true;
        }
        return false;
    }

    public boolean withinBounds(LocationPreviewDTO location, Double north, Double south, Double east, Double west) {
        double locLat = location.getLatitude();
        double locLon = location.getLongitude();

        if (west < east) {
            return locLat > south && locLat < north && locLon > west && locLon < east;
        }
        else {
            return locLat > south && locLat < north && !(locLon > west || locLon < east);
        }
    }

    public boolean withinBounds(HomeLocationDTO location, Double north, Double south, Double east, Double west) {
        double locLat = location.getLatitude();
        double locLon = location.getLongitude();

        if (west < east) {
            return locLat > south && locLat < north && locLon > west && locLon < east;
        }
        else {
            return locLat > south && locLat < north && !(locLon > west || locLon < east);
        }
    }
}

//package com.ShareWhere.ShareWhere.config;
//
//import com.ShareWhere.ShareWhere.models.Comment;
//import com.ShareWhere.ShareWhere.models.Location;
//import com.ShareWhere.ShareWhere.models.Tag;
//import com.ShareWhere.ShareWhere.models.User;
//import com.ShareWhere.ShareWhere.services.CommentService;
//import com.ShareWhere.ShareWhere.services.LocationService;
//import com.ShareWhere.ShareWhere.services.TagService;
//import com.ShareWhere.ShareWhere.services.UserService;
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.springframework.stereotype.Service;
//
//import java.io.File;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class JsonImportService {
//
//    private final UserService userService;
//    private final LocationService locationService;
//    private final TagService tagService;
//    private final CommentService commentService;
//
//    public JsonImportService(UserService userService, LocationService locationService, TagService tagService, CommentService commentService) {
//        this.userService = userService;
//        this.locationService = locationService;
//        this.tagService = tagService;
//        this.commentService = commentService;
//    }
//
//    public void importJSON() {
//        try {
//            // Load JSON File
//            ObjectMapper mapper = new ObjectMapper();
//            JsonNode root = mapper.readTree(new File("C:\\Users\\cole2\\Desktop\\ShareWhere\\ShareWhere\\src\\main\\resources\\data\\data.json"));
//
//            JsonNode tagsNode = root.path("tags");
//            for (JsonNode tagName : tagsNode) {
//                Tag tag = new Tag(tagName.asText());
//                tagService.createTag(tag);
//            }
//
//            JsonNode commentsNode = root.path("comments");
//            for (JsonNode commentNode : commentsNode) {
//                Comment comment = new Comment(
//                        commentNode.path("userId").asInt(),
//                        commentNode.path("locationId").asInt(),
//                        commentNode.path("commentText").asText()
//                );
//
//                List<Tag> commentTags = new ArrayList<>();
//                for (JsonNode commentTagId : commentNode.path("tags")) {
//                    Optional<Tag> tag = tagService.getTagById(commentTagId.asInt());
//                    tag.ifPresent(commentTags::add);
//                }
//
//                comment.setTags(commentTags);
//                commentService.createComment(comment);
//            }
//
//            JsonNode locationsNode = root.path("locations");
//            for (JsonNode locationNode : locationsNode) {
//                Location location = new Location(
//                        locationNode.path("name").asText(),
//                        locationNode.path("description").asText(),
//                        locationNode.path("latitude").asDouble(),
//                        locationNode.path("longitude").asDouble(),
//                        locationNode.path("address").asText()
//                );
//
//                // Attach tags to locations
//                List<Tag> locationTags = new ArrayList<>();
//                for (JsonNode tagIdNode : locationNode.path("tags")) {
//                    int tagId = tagIdNode.asInt();
//                    Optional<Tag> tag = tagService.getTagById(tagId);
//                    tag.ifPresent(locationTags::add);
//                }
//                location.setTags(locationTags);
//
//                List<Comment> locationComments = new ArrayList<>();
//                for (JsonNode commentIdNode : locationNode.path("comments")) {
//                    Optional<Comment> comment = commentService.getCommentById(commentIdNode.asInt());
//                    comment.ifPresent(locationComments::add);
//                }
//                location.setComments(locationComments);
//
//                locationService.createLocation(location);
//            }
//
//            JsonNode usersNode = root.path("users");
//            for (JsonNode userNode : usersNode) {
//                User user = new User(
//                        userNode.path("firstName").asText(),
//                        userNode.path("lastName").asText(),
//                        userNode.path("email").asText(),
//                        userNode.path("username").asText(),
//                        userNode.path("password").asText()
//                );
//
//                List<Location> userPosts = new ArrayList<>();
//                for (JsonNode postIdNode : userNode.path("userPosts")) {
//                    int locationId = postIdNode.asInt();
//                    Optional<Location> location = locationService.getLocationById(locationId);
//                    location.ifPresent(userPosts::add);
//                }
//                user.setUserPosts(userPosts);
//
//                List<Location> savedLocations = new ArrayList<>();
//                for (JsonNode savedLocationIdNode : userNode.path("savedLocations")) {
//                    int locationId = savedLocationIdNode.asInt();
//                    Optional<Location> location = locationService.getLocationById(locationId);
//                    location.ifPresent(savedLocations::add);
//                }
//                user.setSavedLocations(savedLocations);
//
//                userService.createUser(user);
//            }
//            System.out.println("Data imported successfully!");
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//}

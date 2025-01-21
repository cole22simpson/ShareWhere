package com.ShareWhere.ShareWhere.config;

import com.ShareWhere.ShareWhere.services.CommentService;
import com.ShareWhere.ShareWhere.services.LocationService;
import com.ShareWhere.ShareWhere.services.TagService;
import com.ShareWhere.ShareWhere.services.UserService;
import com.opencsv.CSVReader;
import org.springframework.stereotype.Service;

@Service
public class CSVImportService {

    private final CommentService commentService;
    private final UserService userService;
    private final LocationService locationService;
    private final TagService tagService;

    private final String commentCSVPath = "C:\\Users\\cole2\\Desktop\\ShareWhere\\ShareWhere\\src\\main\\resources\\data\\CSV\\Comments.csv";
    private final String locationCSVPath = "C:\\Users\\cole2\\Desktop\\ShareWhere\\ShareWhere\\src\\main\\resources\\data\\CSV\\Locations.csv";
    private final String tagCSVPath = "C:\\Users\\cole2\\Desktop\\ShareWhere\\ShareWhere\\src\\main\\resources\\data\\CSV\\Tags.csv";
    private final String userCSVPath = "C:\\Users\\cole2\\Desktop\\ShareWhere\\ShareWhere\\src\\main\\resources\\data\\CSV\\Users.csv";

    public CSVImportService(CommentService commentService, UserService userService, LocationService locationService, TagService tagService) {
        this.commentService = commentService;
        this.userService = userService;
        this.locationService = locationService;
        this.tagService = tagService;
    }

//    public void importCSVFiles() {
//        try (CSVReader reader = new CSVReader(new FileReader()))
//    }
}

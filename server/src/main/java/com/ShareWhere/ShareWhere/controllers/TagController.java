package com.ShareWhere.ShareWhere.controllers;

import com.ShareWhere.ShareWhere.models.Location;
import com.ShareWhere.ShareWhere.models.Tag;
import com.ShareWhere.ShareWhere.services.TagService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    // Constructor Injection
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<Set<Tag>> getAllTags() {
        Set<Tag> tags = tagService.getAllTags();
        return ResponseEntity.ok(tags);
    }

    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody Tag tag) {
        Tag newTag = tagService.createTag(tag);
        return ResponseEntity.status(HttpStatus.CREATED).body(tag);
    }

    @GetMapping("/{tag_id}")
    public ResponseEntity<Tag> getTagById(@PathVariable("tag_id") int tagId) {
        return tagService.getTagById(tagId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/tag_name")
    public ResponseEntity<Tag> getTagByTagName(@RequestParam("tag_name") String tagName) {
        String noHyphens = tagName.replaceAll("-", " ");
        return tagService.getTagByTagName(noHyphens)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{tag_id}")
    public ResponseEntity<Tag> updateTag(@PathVariable("tag_id") int tagId, @RequestBody Tag tag) {
        Optional<Tag> updatedTag = tagService.updateTag(tagId, tag, false);
        return updatedTag.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{tag_id}")
    public ResponseEntity<Tag> updateTagFields(@PathVariable("tag_id") int tagId, @RequestBody Tag tagUpdates) {
        Optional<Tag> updatedTag = tagService.updateTag(tagId, tagUpdates, true);
        return updatedTag.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{tag_id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("tag_id") int tagId) {
        if (tagService.deleteTag(tagId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

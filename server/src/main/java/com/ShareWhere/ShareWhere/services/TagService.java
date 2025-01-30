package com.ShareWhere.ShareWhere.services;

import com.ShareWhere.ShareWhere.models.Tag;
import com.ShareWhere.ShareWhere.repositories.TagRepo;
import jakarta.transaction.Transactional;
import org.apache.coyote.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class TagService {

    private final TagRepo tagRepo;

    public TagService(TagRepo tagRepo) {
        this.tagRepo = tagRepo;
    }

    public List<Tag> getAllTags() {
        return tagRepo.findAll();
    }

    public Tag createTag(Tag tag) {
        return tagRepo.save(tag);
    }

    public Optional<Tag> getTagById(int tagId) {
        return tagRepo.findById(tagId);
    }

    @Transactional
    public Optional<Tag> updateTag(int tagId, Tag tag, boolean isPartial) {
        return tagRepo.findById(tagId).map(existingTag -> {
            if (tag.getTagName() != null || !isPartial) {
                existingTag.setTagName(tag.getTagName());
            }
            if (tag.getTagGroup() != null || !isPartial) {
                existingTag.setTagGroup(tag.getTagGroup());
            }

            return tagRepo.save(existingTag);
        });
    }

    public boolean deleteTag(int tagId) {
        if (tagRepo.existsById(tagId)) {
            tagRepo.deleteById(tagId);
            return true;
        }
        return false;
    }
}

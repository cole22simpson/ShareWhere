package com.ShareWhere.ShareWhere.DTOs;

import com.ShareWhere.ShareWhere.models.Tag;
import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TagDTO {
    private int tagId;
    private String tagName;
    private Integer tagGroup;
    private LocalDateTime timeCreated;

    public TagDTO(Tag tag) {
        this.tagId = tag.getTagId();
        this.tagName = tag.getTagName();
        this.tagGroup = tag.getTagGroup();
        this.timeCreated = tag.getTimeCreated();
    }
}

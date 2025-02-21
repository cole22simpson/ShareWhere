package com.ShareWhere.ShareWhere.models;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Objects;

// What is a component
@Entity
@Data
@Table(name = "tags")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tagId;

    @Column(nullable = false)
    private String tagName;

    @Column(nullable = false)
    private Integer tagGroup;

    private LocalDateTime timeCreated;

    public Tag() {}

    public Tag(String tagName, Integer tagGroup) {
        this.tagName = tagName;
        this.tagGroup = tagGroup;
        this.timeCreated = LocalDateTime.now();
    }

    public boolean equals(Tag tag) {
        return this.tagId == tag.getTagId();
    }

    public int hashCode() {
        return Objects.hash(tagId);
    }
}

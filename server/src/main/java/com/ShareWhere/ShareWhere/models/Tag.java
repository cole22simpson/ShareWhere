package com.ShareWhere.ShareWhere.models;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

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

    private LocalDateTime timeCreated;

    public Tag() {}

    public Tag(String tagName) {
        this.tagName = tagName;
        this.timeCreated = LocalDateTime.now();
    }
}

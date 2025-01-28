package com.ShareWhere.ShareWhere.config;

import lombok.*;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@ConfigurationProperties(prefix = "app")
@Configuration
@Getter
@Setter
public class AppProperties {

    private String googleMapsAPIKey;
    private String reactURL;
}

package com.ShareWhere.ShareWhere.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Getter
public class AppPropertiesService {

    private final AppProperties appProperties;
}

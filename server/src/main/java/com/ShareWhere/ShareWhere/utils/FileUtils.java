package com.ShareWhere.ShareWhere.utils;

import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStream;

public class FileUtils {

    private static final String DEFAULT_PROFILE_PIC_PATH = "images/default_image.png";

    public static byte[] loadDefaultProfilePicture() throws IOException {
        ClassPathResource imgFile = new ClassPathResource(DEFAULT_PROFILE_PIC_PATH);
        try (InputStream inputStream = imgFile.getInputStream()) {
            return FileCopyUtils.copyToByteArray(inputStream);
        }
    }
}

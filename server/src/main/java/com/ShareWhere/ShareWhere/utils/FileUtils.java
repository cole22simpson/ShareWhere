package com.ShareWhere.ShareWhere.utils;

import com.ShareWhere.ShareWhere.models.DefaultMultipartFile;
import com.ShareWhere.ShareWhere.services.AzureBlobStorageService;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Component
public class FileUtils {

    private static final String DEFAULT_PROFILE_PIC_PATH = "images/default-image.png";

    private final AzureBlobStorageService azureBlobStorageService;

    public FileUtils(AzureBlobStorageService azureBlobStorageService) {
        this.azureBlobStorageService = azureBlobStorageService;
    }

    public String loadDefaultProfilePicture() throws IOException {
        ClassPathResource imgFile = new ClassPathResource(DEFAULT_PROFILE_PIC_PATH);
        byte[] fileBytes = FileCopyUtils.copyToByteArray(imgFile.getInputStream());
        MultipartFile defaultImageFile = new DefaultMultipartFile(
                "default-profile-pic",
                "default-image.png",
                "image/png",
                fileBytes
        );

        return azureBlobStorageService.uploadFile(defaultImageFile);
    }
}

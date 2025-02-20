package com.ShareWhere.ShareWhere.services;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobClientBuilder;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobContainerClientBuilder;
import com.azure.storage.common.StorageSharedKeyCredential;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class AzureBlobStorageService {

    private final BlobContainerClient containerClient;

    // Constructor now takes account name and account key from application.properties or environment variables
    public AzureBlobStorageService(
            @Value("${spring.cloud.azure.storage.blob.account-name}") String accountName,
            @Value("${spring.cloud.azure.storage.blob.account-key}") String accountKey,
            @Value("${spring.cloud.azure.storage.blob.container-name}") String containerName) {

        // Use account name and account key to create a StorageSharedKeyCredential
        StorageSharedKeyCredential credential = new StorageSharedKeyCredential(accountName, accountKey);

        // Use the credential to create the BlobContainerClient
        this.containerClient = new BlobContainerClientBuilder()
                .endpoint("https://" + accountName + ".blob.core.windows.net") // Construct the endpoint URL
                .credential(credential)
                .containerName(containerName)
                .buildClient();
    }

    // Method to upload files to Azure Blob Storage
    public String uploadFile(MultipartFile file) throws IOException {
        String blobName = file.getOriginalFilename();
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        try (InputStream inputStream = file.getInputStream()) {
            blobClient.upload(inputStream, file.getSize(), true);
        }

        // Return the URL of the uploaded blob
        return blobClient.getBlobUrl();
    }
}

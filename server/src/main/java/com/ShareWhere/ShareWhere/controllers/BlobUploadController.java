package com.ShareWhere.ShareWhere.controllers;

import com.ShareWhere.ShareWhere.services.AzureBlobStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/blob")
public class BlobUploadController {

    private final AzureBlobStorageService azureBlobStorageService;

    @Autowired
    public BlobUploadController(AzureBlobStorageService azureBlobStorageService) {
        this.azureBlobStorageService = azureBlobStorageService;
    }

    // Endpoint for uploading a file to Azure Blob Storage
    @PostMapping("/upload")
    public ResponseEntity<String> uploadBlob(@RequestParam("file") MultipartFile file) {
        try {
            // Call the service to upload the file and get the blob URL
            String blobUrl = azureBlobStorageService.uploadFile(file);
            return new ResponseEntity<>(blobUrl, HttpStatus.OK);
        } catch (IOException e) {
            // Return an error message if something goes wrong
            return new ResponseEntity<>("Error uploading file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

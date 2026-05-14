package com.promorural.api.core.application.service;

import com.promorural.api.core.domain.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.file-upload.upload-dir}")
    private String uploadDir;

    @Value("${app.file-upload.base-url}")
    private String baseUrl;

    /**
     * Stores a file on the local file system and returns its accessible URL.
     * @param file The file to store.
     * @return The URL to access the stored file.
     */
    public String storeFile(MultipartFile file) {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        try {
            Files.createDirectories(uploadPath);
            Files.copy(file.getInputStream(), filePath);
        } catch (IOException e) {
            throw new FileStorageException("Could not store uploaded file", e);
        }

        return baseUrl + "/" + fileName;
    }

    /**
     * Deletes a file from the local file system given its URL.
     * @param fileUrl The URL of the file to delete.
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith(baseUrl)) {
            return;
        }

        String fileName = fileUrl.substring(baseUrl.length() + 1);
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Could not delete stored file", e);
        }
    }
}

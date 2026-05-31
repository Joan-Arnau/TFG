package com.promorural.api.infrastructure.filestorage;

import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.FileStorageException;
import com.promorural.api.core.application.port.FileStoragePort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.promorural.api.core.application.dto.FileData;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class LocalFileStorage implements FileStoragePort {

    @Value("${app.file-upload.upload-dir}")
    private String uploadDir;

    @Value("${app.file-upload.base-url}")
    private String baseUrl;

    private static final long DEFAULT_MAX_BYTES = 2 * 1024 * 1024;

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/png",
            "image/jpeg",
            "image/webp"
    );

    @Override
    public String storeFile(FileData file, String subdir) {
        if (file == null || file.getSize() == 0) {
            throw new BadRequestException("Uploaded file is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new BadRequestException("Unsupported file type. Only PNG, JPEG and WEBP are allowed.");
        }

        if (file.getSize() > DEFAULT_MAX_BYTES) {
            throw new BadRequestException("File is too large. Maximum allowed size is 2MB.");
        }

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (subdir != null && !subdir.isBlank()) {
            uploadPath = uploadPath.resolve(subdir);
        }

        String extension = getFileExtension(file.getOriginalFilename(), contentType);
        String fileName = UUID.randomUUID().toString() + (extension != null ? "." + extension : "");
        Path filePath = uploadPath.resolve(fileName);

        try {
            Files.createDirectories(uploadPath);
            Files.write(filePath, file.getContent());
        } catch (IOException e) {
            throw new FileStorageException("Could not store uploaded file", e);
        }

        String relative = (subdir != null && !subdir.isBlank()) ? subdir + "/" + fileName : fileName;
        return normalizeBaseUrl() + "/" + relative;
    }

    @Override
    public String storeFile(FileData file) {
        return storeFile(file, null);
    }

    @Override
    public void deleteFile(String fileUrl) {
        String normalizedBaseUrl = normalizeBaseUrl();
        if (fileUrl == null || !fileUrl.startsWith(normalizedBaseUrl)) {
            return;
        }

        String fileName = fileUrl.substring(normalizedBaseUrl.length() + 1);
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Could not delete stored file", e);
        }
    }

    private String normalizeBaseUrl() {
        if (baseUrl == null || baseUrl.isBlank()) {
            return "/uploads";
        }

        return normalizeRelativeBaseUrl(baseUrl.trim());
    }

    private String normalizeRelativeBaseUrl(String value) {
        if (value == null || value.isBlank()) {
            return "/uploads";
        }

        String relative = value.startsWith("/") ? value : "/" + value;
        while (relative.endsWith("/") && relative.length() > 1) {
            relative = relative.substring(0, relative.length() - 1);
        }
        return relative;
    }

    private String getFileExtension(String originalName, String contentType) {
        if (originalName != null && originalName.contains(".")) {
            String ext = originalName.substring(originalName.lastIndexOf('.') + 1);
            return ext.toLowerCase(Locale.ROOT);
        }

        return switch (contentType) {
            case "image/png" -> "png";
            case "image/jpeg" -> "jpg";
            case "image/webp" -> "webp";
            default -> null;
        };
    }
}

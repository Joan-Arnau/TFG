package com.promorural.api.core.application.service.use_case.admin;

import com.promorural.api.core.application.service.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class FileUploadUseCase {

    private final FileStorageService fileStorageService;

    public FileUploadUseCase(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    public Map<String, String> uploadFile(MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        return Map.of("url", fileUrl);
    }
}

package com.promorural.api.core.application.service.use_case.admin;

import com.promorural.api.core.application.port.FileStoragePort;
import org.springframework.stereotype.Service;
import com.promorural.api.core.application.dto.FileData;

import java.util.Map;

@Service
public class FileUploadUseCase {

    private final FileStoragePort fileStorageService;

    public FileUploadUseCase(FileStoragePort fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    public Map<String, String> uploadFile(FileData file) {
        String fileUrl = fileStorageService.storeFile(file);
        return Map.of("url", fileUrl);
    }
}

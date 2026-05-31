package com.promorural.api.core.application.port;

import com.promorural.api.core.application.dto.FileData;

public interface FileStoragePort {
    String storeFile(FileData file, String subdir);
    String storeFile(FileData file);
    void deleteFile(String fileUrl);
}

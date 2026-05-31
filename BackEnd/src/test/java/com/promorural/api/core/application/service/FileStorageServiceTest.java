package com.promorural.api.core.application.service;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FileStorageServiceTest {

    private final com.promorural.api.infrastructure.filestorage.LocalFileStorage service = new com.promorural.api.infrastructure.filestorage.LocalFileStorage();
    private final Path testDir = Path.of("target/test-uploads");

    public FileStorageServiceTest() {
        ReflectionTestUtils.setField(service, "uploadDir", testDir.toString());
        ReflectionTestUtils.setField(service, "baseUrl", "/uploads");
    }

    @AfterEach
    void cleanup() throws IOException {
        if (Files.exists(testDir)) {
            Files.walk(testDir)
                    .sorted((a, b) -> b.compareTo(a))
                    .forEach(p -> p.toFile().delete());
        }
    }

    @Test
    void storeFile_createsFileAndReturnsUrl_withSubdir() throws Exception {
        com.promorural.api.core.application.dto.FileData file = new com.promorural.api.core.application.dto.FileData(
            "PNGDATA".getBytes(), "photo.png", "image/png", "PNGDATA".getBytes().length
        );

        String url = service.storeFile(file, "gallery");

        assertThat(url).startsWith("/uploads/");
        assertThat(url).contains("gallery/");

        // Verify file exists on disk
        String relative = url.substring("/uploads/".length());
        Path stored = testDir.resolve(relative);
        assertThat(Files.exists(stored)).isTrue();
    }

    @Test
    void storeFile_rejectsUnsupportedMimeType() {
        com.promorural.api.core.application.dto.FileData file = new com.promorural.api.core.application.dto.FileData(
            "PDFDATA".getBytes(), "doc.pdf", "application/pdf", "PDFDATA".getBytes().length
        );

        assertThatThrownBy(() -> service.storeFile(file, "gallery"))
                .hasMessageContaining("Unsupported file type");
    }

    @Test
    void storeFile_rejectsTooLargeFile() {
        byte[] big = new byte[(2 * 1024 * 1024) + 10];
        com.promorural.api.core.application.dto.FileData file = new com.promorural.api.core.application.dto.FileData(
            big, "big.jpg", "image/jpeg", big.length
        );

        assertThatThrownBy(() -> service.storeFile(file, "gallery"))
                .hasMessageContaining("File is too large");
    }

    @Test
    void storeFile_rejectsEmptyFile() {
        com.promorural.api.core.application.dto.FileData file = new com.promorural.api.core.application.dto.FileData(
            new byte[0], "empty.png", "image/png", 0
        );

        assertThatThrownBy(() -> service.storeFile(file, "gallery"))
                .hasMessageContaining("Uploaded file is empty");
    }
}

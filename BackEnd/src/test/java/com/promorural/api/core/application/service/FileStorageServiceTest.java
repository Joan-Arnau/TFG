package com.promorural.api.core.application.service;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FileStorageServiceTest {

    private final FileStorageService service = new FileStorageService();
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
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "photo.png",
                "image/png",
                "PNGDATA".getBytes()
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
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "doc.pdf",
                "application/pdf",
                "PDFDATA".getBytes()
        );

        assertThatThrownBy(() -> service.storeFile(file, "gallery"))
                .hasMessageContaining("Unsupported file type");
    }

    @Test
    void storeFile_rejectsTooLargeFile() {
        byte[] big = new byte[(2 * 1024 * 1024) + 10];
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "big.jpg",
                "image/jpeg",
                big
        );

        assertThatThrownBy(() -> service.storeFile(file, "gallery"))
                .hasMessageContaining("File is too large");
    }

    @Test
    void storeFile_rejectsEmptyFile() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "empty.png",
                "image/png",
                new byte[0]
        );

        assertThatThrownBy(() -> service.storeFile(file, "gallery"))
                .hasMessageContaining("Uploaded file is empty");
    }
}

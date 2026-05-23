package com.promorural.api.core.application.service;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class FileStorageServiceTest {

    private final FileStorageService service = new FileStorageService();
    private final Path testDir = Path.of("target/test-uploads");

    public FileStorageServiceTest() {
        ReflectionTestUtils.setField(service, "uploadDir", testDir.toString());
        ReflectionTestUtils.setField(service, "baseUrl", "http://localhost:8080/uploads");
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

        assertThat(url).startsWith("http://localhost:8080/uploads/");
        assertThat(url).contains("gallery/");

        // Verify file exists on disk
        String relative = url.substring("http://localhost:8080/uploads/".length());
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

        try {
            service.storeFile(file, "gallery");
        } catch (Exception e) {
            assertThat(e).hasMessageContaining("Unsupported file type");
        }
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

        try {
            service.storeFile(file, "gallery");
        } catch (Exception e) {
            assertThat(e).hasMessageContaining("File is too large");
        }
    }
}

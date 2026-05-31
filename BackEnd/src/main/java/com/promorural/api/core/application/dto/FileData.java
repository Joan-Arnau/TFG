package com.promorural.api.core.application.dto;

public class FileData {
    private final byte[] content;
    private final String originalFilename;
    private final String contentType;
    private final long size;

    public FileData(byte[] content, String originalFilename, String contentType, long size) {
        this.content = content;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.size = size;
    }

    public byte[] getContent() { return content; }
    public String getOriginalFilename() { return originalFilename; }
    public String getContentType() { return contentType; }
    public long getSize() { return size; }
}

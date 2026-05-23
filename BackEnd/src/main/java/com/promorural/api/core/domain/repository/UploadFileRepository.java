package com.promorural.api.core.domain.repository;

import com.promorural.api.core.domain.entity.UploadFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UploadFileRepository extends JpaRepository<UploadFile, Long> {
    List<UploadFile> findByShopId(Long shopId);
}

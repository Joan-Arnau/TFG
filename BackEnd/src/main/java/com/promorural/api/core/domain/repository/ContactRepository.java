package com.promorural.api.core.domain.repository;

import com.promorural.api.core.domain.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    long countByCategoryId(Long categoryId);
}

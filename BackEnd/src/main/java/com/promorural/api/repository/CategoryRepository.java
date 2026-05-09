package com.promorural.api.repository;

import com.promorural.api.entity.Category;
import com.promorural.api.entity.CategoryType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByType(CategoryType type);
}

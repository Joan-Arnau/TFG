package com.promorural.api.core.domain.repository;

import com.promorural.api.core.domain.entity.Event;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByOrderByStartsAtAsc();
    long countByCategoryId(Long categoryId);
}

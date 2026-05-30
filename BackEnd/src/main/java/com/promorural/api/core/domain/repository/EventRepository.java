package com.promorural.api.core.domain.repository;

import com.promorural.api.core.domain.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByOrderByStartsAtAsc();
    long countByCategoryId(Long categoryId);
    List<Event> findByStartsAtBetweenOrderByStartsAtAsc(OffsetDateTime start, OffsetDateTime end);
    List<Event> findByCategoryId(Long categoryId);
    List<Event> findByIsFestivalTrueOrderByStartsAtAsc();
    List<Event> findByIsFestivalFalseOrderByStartsAtAsc();
}

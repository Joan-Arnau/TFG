package com.promorural.api.repository;

import com.promorural.api.entity.Event;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByOrderByStartsAtAsc();
}

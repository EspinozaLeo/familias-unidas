package com.familiasunidas.familias_unidas.repository;

import com.familiasunidas.familias_unidas.model.DeathEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeathEventRepository extends JpaRepository<DeathEvent, Long> {
    List<DeathEvent> findAllByOrderByDateOfDeathDesc();
}

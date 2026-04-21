package com.familiasunidas.familias_unidas.controller;

import com.familiasunidas.familias_unidas.dto.CreateDeathEventRequest;
import com.familiasunidas.familias_unidas.dto.DeathEventDTO;
import com.familiasunidas.familias_unidas.service.DeathEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/death-events")
public class DeathEventController {

    private final DeathEventService deathEventService;

    @Autowired
    public DeathEventController(DeathEventService deathEventService) {
        this.deathEventService = deathEventService;
    }

    // Get all death events (sorted newest first)
    @GetMapping
    public List<DeathEventDTO> getAllDeathEvents() {
        return deathEventService.getAllDeathEvents();
    }

    // Get a single death event by ID
    @GetMapping("/{id}")
    public ResponseEntity<DeathEventDTO> getDeathEventById(@PathVariable Long id) {
        return deathEventService.getDeathEventById(id);
    }

    // Record a new death — auto-generates donation payments for all other families
    @PostMapping
    public ResponseEntity<DeathEventDTO> createDeathEvent(@RequestBody CreateDeathEventRequest request) {
        return deathEventService.createDeathEvent(request);
    }

    // Delete a death event and all its associated payments
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeathEvent(@PathVariable Long id) {
        return deathEventService.deleteDeathEvent(id);
    }
}

package com.familiasunidas.familias_unidas.controller;

import com.familiasunidas.familias_unidas.dto.AnalyticsDTO;
import com.familiasunidas.familias_unidas.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Autowired
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public AnalyticsDTO getSummary() {
        return analyticsService.getSummary();
    }
}

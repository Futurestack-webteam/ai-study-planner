package com.aistudyplanner.backend.controller;

import com.aistudyplanner.backend.model.StudyPlan;
import com.aistudyplanner.backend.service.StudyPlanService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studyplans")
@CrossOrigin(origins = "http://localhost:5173")
public class StudyPlanController {

    @Autowired
    private StudyPlanService service;

    @PostMapping
    public StudyPlan savePlan(@RequestBody StudyPlan plan) {
        return service.savePlan(plan);
    }

    @GetMapping
    public List<StudyPlan> getAllPlans() {
        return service.getAllPlans();
    }
}
package com.aistudyplanner.backend.service;

import com.aistudyplanner.backend.model.StudyPlan;
import com.aistudyplanner.backend.repository.StudyPlanRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudyPlanService {

    @Autowired
    private StudyPlanRepository repository;

    public StudyPlan savePlan(StudyPlan plan) {

        plan.setCreatedAt(
                LocalDateTime.now().toString()
        );

        return repository.save(plan);
    }

    public List<StudyPlan> getAllPlans() {
        return repository.findAll();
    }
}
package com.aistudyplanner.backend.repository;

import com.aistudyplanner.backend.model.StudyPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StudyPlanRepository extends MongoRepository<StudyPlan, String> {
}
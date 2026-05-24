package com.aistudyplanner.backend.repository;

import com.aistudyplanner.backend.model.Quiz;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface QuizRepository
        extends MongoRepository<Quiz, String> {
}
package com.aistudyplanner.backend.service;

import com.aistudyplanner.backend.model.Quiz;
import com.aistudyplanner.backend.repository.QuizRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizRepository repository;

    public Quiz saveQuiz(Quiz quiz) {

        quiz.setCreatedAt(
                LocalDateTime.now().toString()
        );

        return repository.save(quiz);
    }

    public List<Quiz> getAllQuizzes() {
        return repository.findAll();
    }
}
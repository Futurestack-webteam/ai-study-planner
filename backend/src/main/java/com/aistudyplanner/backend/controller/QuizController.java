package com.aistudyplanner.backend.controller;

import com.aistudyplanner.backend.model.Quiz;
import com.aistudyplanner.backend.service.QuizService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    @Autowired
    private QuizService service;

    @PostMapping
    public Quiz saveQuiz(
            @RequestBody Quiz quiz
    ) {

        return service.saveQuiz(quiz);
    }

    @GetMapping
    public List<Quiz> getAllQuizzes() {

        return service.getAllQuizzes();
    }
}
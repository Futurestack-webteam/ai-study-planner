package com.aistudyplanner.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "quizzes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {

    @Id
    private String id;

    private String subject;

    private String educationLevel;

    private String quizData;

    private String userEmail;

    private String guestId;

    private String createdAt;
}
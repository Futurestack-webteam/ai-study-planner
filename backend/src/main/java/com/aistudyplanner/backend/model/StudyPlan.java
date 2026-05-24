package com.aistudyplanner.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "studyplans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyPlan {

    @Id
    private String id;

    private String studentName;
    private String className;
    private String subject;
    private String timetable;
    private String userEmail;
    private String guestId;
    private boolean completed = false;
    private String createdAt;
}
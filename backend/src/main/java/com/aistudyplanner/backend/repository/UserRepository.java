package com.aistudyplanner.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.aistudyplanner.backend.model.User;

public interface UserRepository
        extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);
}
package com.aistudyplanner.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtUtil {

    // MUST be minimum 32+ characters
    private final String SECRET_KEY =
            "myverysecuresecretkeyforaistudyplannerjwt2026";

    // 7 days
    private final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24 * 7;

    // Generate Secret Key
    private Key getSignKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes()
        );
    }

    // Generate JWT Token
    public String generateToken(String email) {

        return Jwts.builder()

                .subject(email)

                .issuedAt(new Date())

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION_TIME
                        )
                )

                .signWith(
                        getSignKey(),
                        SignatureAlgorithm.HS256
                )

                .compact();
    }

    // Extract Email
    public String extractEmail(String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    // Extract Claims
    private Claims extractAllClaims(String token) {

        return Jwts.parser()

                .verifyWith(
                        (javax.crypto.SecretKey) getSignKey()
                )

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }

    // Validate Token
    public boolean validateToken(
            String token,
            String email
    ) {

        final String extractedEmail =
                extractEmail(token);

        return extractedEmail.equals(email)
                && !isTokenExpired(token);
    }

    // Check Expiry
    private boolean isTokenExpired(String token) {

        return extractAllClaims(token)

                .getExpiration()

                .before(new Date());
    }
}
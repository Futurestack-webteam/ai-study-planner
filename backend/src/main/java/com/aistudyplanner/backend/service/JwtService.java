package com.aistudyplanner.backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    // MUST be 32+ characters
    private static final String SECRET =
            "aistudyplannersecurejwtsecretkey2026project";

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                SECRET.getBytes()
        );
    }

    // Generate Token
    public String generateToken(String email) {

        return Jwts.builder()

                .subject(email)

                .issuedAt(new Date())

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 1000 * 60 * 60 * 24
                        )
                )

                .signWith(
                        getSigningKey(),
                        SignatureAlgorithm.HS256
                )

                .compact();
    }

    // Extract Email
    public String extractEmail(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }

    // Extract Claims
    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver
    ) {

        final Claims claims =
                extractAllClaims(token);

        return claimsResolver.apply(claims);
    }

    // Extract All Claims
    private Claims extractAllClaims(String token) {

        return Jwts.parser()

                .verifyWith(getSigningKey())

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
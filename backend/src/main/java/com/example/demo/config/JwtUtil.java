package com.example.demo.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "THIS_IS_MY_SECRET_KEY_FOR_JWT_1234567890";  // must be 32 chars+
    private final long EXPIRATION = 1000 * 60 * 60;  // 1 hour

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // -------------------------------------------------------
    // CREATE JWT TOKEN (email is used as subject)
    // -------------------------------------------------------
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // -------------------------------------------------------
    // VALIDATE TOKEN (with email comparison)
    // -------------------------------------------------------
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);

        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // -------------------------------------------------------
    // EXTRACT EMAIL (subject)
    // -------------------------------------------------------
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // -------------------------------------------------------
    // CHECK EXPIRATION
    // -------------------------------------------------------
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // -------------------------------------------------------
    // PARSE ALL CLAIMS SAFELY
    // -------------------------------------------------------
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

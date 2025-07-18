package com.example.gestionprojet.constant;

public final class SecurityConstants {
    private SecurityConstants() {
        throw new IllegalStateException("Utility class");
    }

    public static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    public static final long TOKEN_EXPIRATION = 24 * 60 * 60 * 1000; // 24 heures
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String[] PUBLIC_URLS = {
        "/api/auth/register",
        "/api/auth/login",
        "/swagger-ui/**",
        "/v3/api-docs/**"
    };
} 
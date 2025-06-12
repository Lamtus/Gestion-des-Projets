package com.example.gestionprojet.web.controller;

import com.example.gestionprojet.business.service.UserService;
import com.example.gestionprojet.web.dto.UserWithProjectCountDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/with-project-count")
    public ResponseEntity<List<UserWithProjectCountDto>> getAllUsersWithProjectCount() {
        List<UserWithProjectCountDto> users = userService.getAllUsersWithProjectCount();
        return ResponseEntity.ok(users);
    }
} 
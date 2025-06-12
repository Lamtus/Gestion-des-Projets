package com.example.gestionprojet.business.service;

import com.example.gestionprojet.web.dto.UserWithProjectCountDto;
import java.util.List;
 
public interface UserService {
    List<UserWithProjectCountDto> getAllUsersWithProjectCount();
} 
package com.example.gestionprojet.business.impl;

import com.example.gestionprojet.business.service.UserService;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.repository.ProjetsRepository;
import com.example.gestionprojet.dao.repository.UserRepository;
import com.example.gestionprojet.dao.repository.ChefRepository;
import com.example.gestionprojet.dao.model.Chef;
import com.example.gestionprojet.web.dto.UserWithProjectCountDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ProjetsRepository projetsRepository;
    private final ChefRepository chefRepository;

    @Override
    public List<UserWithProjectCountDto> getAllUsersWithProjectCount() {
        List<User> users = userRepository.findAll();

        return users.stream().map(user -> {
            if (user == null) {
                return null;
            }
            List<Chef> chefsProjects = chefRepository.findByChef(user);
            int numberOfProjectsLed = (chefsProjects != null) ? chefsProjects.size() : 0;

            return UserWithProjectCountDto.builder()
                    .id(user.getId())
                    .nom(user.getNom())
                    .prenom(user.getPrenom())
                    .poste(user.getPoste())
                    .departement(user.getDepartement())
                    .role(user.getRole())
                    .numberOfProjectsLed(numberOfProjectsLed)
                    .build();
        })
        .filter(dto -> dto != null)
        .collect(Collectors.toList());
    }
}
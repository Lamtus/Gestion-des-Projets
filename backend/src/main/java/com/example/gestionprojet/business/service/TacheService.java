package com.example.gestionprojet.business.service;

import com.example.gestionprojet.dao.model.Tache;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.web.dto.CreateTacheRequest;
import com.example.gestionprojet.web.dto.UpdateTacheRequest;
import com.example.gestionprojet.web.dto.UpdateTacheStatutRequest;
import com.example.gestionprojet.web.dto.UpdateTacheProgressionRequest;

import java.util.List;

public interface TacheService {
    List<Tache> getTachesByProjet(Long idProjet);
    Tache createTache(Long idProjet, CreateTacheRequest request, User user);
    Tache updateTache(Long idTache, UpdateTacheRequest request, User user);
    Tache updateTacheStatut(Long idTache, UpdateTacheStatutRequest request, User user);
    Tache updateTacheProgression(Long idTache, UpdateTacheProgressionRequest request, User user);
} 
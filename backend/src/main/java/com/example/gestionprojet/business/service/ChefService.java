package com.example.gestionprojet.business.service;

import com.example.gestionprojet.dao.model.Chef;
import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.model.User;

public interface ChefService {
    Chef assignChefToProjet(Projet projet, User utilisateur);
    void removeChefFromProjet(Projet projet);
}

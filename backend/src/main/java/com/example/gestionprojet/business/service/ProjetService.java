package com.example.gestionprojet.business.service;

import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.web.dto.CreateProjetRequest;
import com.example.gestionprojet.web.dto.UpdateProjetRequest;
import com.example.gestionprojet.web.dto.ChangeChefProjetRequest;
import com.example.gestionprojet.web.dto.ProjetResponse;

import java.util.List;

public interface ProjetService {
    Projet getProjetById(Long idProjet);
    Projet addProjet(CreateProjetRequest request, User user);
    Projet updateProjet(Long idProjet, UpdateProjetRequest request, User user);
    Projet changeChefProjet(Long idProjet, ChangeChefProjetRequest request, User user);
    List<ProjetResponse> getProjetsByDirecteur(User directeur);
}

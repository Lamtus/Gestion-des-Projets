package com.example.gestionprojet.business.service;

import com.example.gestionprojet.dao.model.Affectation;
import com.example.gestionprojet.dao.model.Tache;
import com.example.gestionprojet.dao.model.User;
import java.util.List;

public interface AffectationService {
    Affectation affecterTache(Long idTache, Long idMembre, User user);
    List<Tache> getTachesByMembre(User membre);
}

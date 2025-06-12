package com.example.gestionprojet.dao.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.model.User;
import java.util.List;

public interface ProjetsRepository extends JpaRepository<Projet, Long> {
    boolean existsByTitre(String titre);
    List<Projet> findByDirecteur(User directeur);
}

package com.example.gestionprojet.dao.repository;

import com.example.gestionprojet.dao.model.Tache;
import com.example.gestionprojet.dao.model.Projet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TacheRepository extends JpaRepository<Tache, Long> {
    List<Tache> findByProjet(Projet projet);
} 
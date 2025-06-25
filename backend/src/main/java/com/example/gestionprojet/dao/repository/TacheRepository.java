package com.example.gestionprojet.dao.repository;

import com.example.gestionprojet.dao.model.Tache;
import com.example.gestionprojet.dao.model.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TacheRepository extends JpaRepository<Tache, Long> {
    List<Tache> findByProjet(Projet projet);

    @Query("SELECT t FROM Tache t LEFT JOIN FETCH t.predecesseurs WHERE t.projet = :projet")
    List<Tache> findByProjetWithPredecesseurs(@Param("projet") Projet projet);
} 
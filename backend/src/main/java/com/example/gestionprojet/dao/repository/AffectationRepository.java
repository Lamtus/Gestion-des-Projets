package com.example.gestionprojet.dao.repository;

import com.example.gestionprojet.dao.model.Affectation;
import com.example.gestionprojet.dao.model.Tache;
import com.example.gestionprojet.dao.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AffectationRepository extends JpaRepository<Affectation, Long> {
    List<Affectation> findByMembre(User membre);
    Optional<Affectation> findByTacheAndMembre(Tache tache, User membre);
    Optional<Affectation> findByTache(Tache tache);
} 
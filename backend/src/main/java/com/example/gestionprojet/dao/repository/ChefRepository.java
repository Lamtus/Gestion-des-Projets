package com.example.gestionprojet.dao.repository;

import com.example.gestionprojet.dao.model.Chef;
import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChefRepository extends JpaRepository<Chef, Long> {
    void deleteByProjet(Projet projet);
    Optional<Chef> findByProjet(Projet projet);
    List<Chef> findByChef(User chef);
}

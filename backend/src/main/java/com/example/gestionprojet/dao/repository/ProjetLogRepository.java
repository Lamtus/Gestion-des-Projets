package com.example.gestionprojet.dao.repository;

import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.model.ProjetLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjetLogRepository extends JpaRepository<ProjetLog, Long> {
    List<ProjetLog> findByProjetOrderByIdLogDesc(Projet projet);
} 
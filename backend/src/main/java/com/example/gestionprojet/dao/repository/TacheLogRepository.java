package com.example.gestionprojet.dao.repository;

import com.example.gestionprojet.dao.model.Tache;
import com.example.gestionprojet.dao.model.TacheLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TacheLogRepository extends JpaRepository<TacheLog, Long> {
    List<TacheLog> findByTacheOrderByIdLogDesc(Tache tache);
} 
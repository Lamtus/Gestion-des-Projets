package com.example.gestionprojet.business.service;

import com.example.gestionprojet.dao.model.ProjetLog;
import java.util.List;

public interface ProjetLogService {
    List<ProjetLog> getLogsByProjet(Long idProjet);
    void createLog(Long idProjet, String message);
} 
package com.example.gestionprojet.business.service;

import com.example.gestionprojet.dao.model.TacheLog;
import java.util.List;

public interface TacheLogService {
    List<TacheLog> getLogsByTache(Long idTache);
    void createLog(Long idTache, String message);
} 
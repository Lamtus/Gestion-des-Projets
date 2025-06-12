package com.example.gestionprojet.business.impl;

import com.example.gestionprojet.business.service.TacheLogService;
import com.example.gestionprojet.dao.model.Tache;
import com.example.gestionprojet.dao.model.TacheLog;
import com.example.gestionprojet.dao.repository.TacheLogRepository;
import com.example.gestionprojet.dao.repository.TacheRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TacheLogServiceImpl implements TacheLogService {
    private final TacheLogRepository tacheLogRepository;
    private final TacheRepository tacheRepository;

    @Override
    public List<TacheLog> getLogsByTache(Long idTache) {
        Tache tache = tacheRepository.findById(idTache)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));
        return tacheLogRepository.findByTacheOrderByIdLogDesc(tache);
    }

    @Override
    @Transactional
    public void createLog(Long idTache, String message) {
        Tache tache = tacheRepository.findById(idTache)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));
        
        TacheLog log = new TacheLog();
        log.setTache(tache);
        log.setMessage(message);
        tacheLogRepository.save(log);
    }
} 
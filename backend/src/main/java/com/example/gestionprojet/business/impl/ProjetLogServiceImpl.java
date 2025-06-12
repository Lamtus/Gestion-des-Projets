package com.example.gestionprojet.business.impl;

import com.example.gestionprojet.business.service.ProjetLogService;
import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.model.ProjetLog;
import com.example.gestionprojet.dao.repository.ProjetLogRepository;
import com.example.gestionprojet.dao.repository.ProjetsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjetLogServiceImpl implements ProjetLogService {
    private final ProjetLogRepository projetLogRepository;
    private final ProjetsRepository projetRepository;

    @Override
    public List<ProjetLog> getLogsByProjet(Long idProjet) {
        Projet projet = projetRepository.findById(idProjet)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));
        return projetLogRepository.findByProjetOrderByIdLogDesc(projet);
    }

    @Override
    @Transactional
    public void createLog(Long idProjet, String message) {
        Projet projet = projetRepository.findById(idProjet)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));
        
        ProjetLog log = new ProjetLog();
        log.setProjet(projet);
        log.setMessage(message);
        projetLogRepository.save(log);
    }
} 
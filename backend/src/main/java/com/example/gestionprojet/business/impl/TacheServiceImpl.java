package com.example.gestionprojet.business.impl;

import com.example.gestionprojet.business.service.TacheLogService;
import com.example.gestionprojet.business.service.TacheService;
import com.example.gestionprojet.dao.model.Affectation;
import com.example.gestionprojet.dao.model.Chef;
import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.model.Tache;
import com.example.gestionprojet.dao.model.TacheLog;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.dao.repository.AffectationRepository;
import com.example.gestionprojet.dao.repository.ChefRepository;
import com.example.gestionprojet.dao.repository.ProjetsRepository;
import com.example.gestionprojet.dao.repository.TacheLogRepository;
import com.example.gestionprojet.dao.repository.TacheRepository;
import com.example.gestionprojet.exception.BusinessException;
import com.example.gestionprojet.web.dto.CreateTacheRequest;
import com.example.gestionprojet.web.dto.UpdateTacheRequest;
import com.example.gestionprojet.web.dto.UpdateTacheStatutRequest;
import com.example.gestionprojet.web.dto.UpdateTacheProgressionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TacheServiceImpl implements TacheService {
    private final TacheRepository tacheRepository;
    private final ProjetsRepository projetRepository;
    private final ChefRepository chefRepository;
    private final AffectationRepository affectationRepository;
    private final TacheLogRepository tacheLogRepository;
    private final TacheLogService tacheLogService;

    @Override
    public List<Tache> getTachesByProjet(Long idProjet) {
        Projet projet = projetRepository.findById(idProjet)
            .orElseThrow(() -> new BusinessException("Projet non trouvé"));
        return tacheRepository.findByProjet(projet);
    }

    @Override
    @Transactional
    public Tache createTache(Long idProjet, CreateTacheRequest request, User user) {
        // Vérifier si le projet existe
        Projet projet = projetRepository.findById(idProjet)
            .orElseThrow(() -> new RuntimeException("Projet non trouvé"));

        // Vérifier si l'utilisateur est le chef du projet
        Chef chefProjet = chefRepository.findByProjet(projet)
            .orElseThrow(() -> new RuntimeException("Aucun chef n'est assigné à ce projet"));

        if (!chefProjet.getChef().getId().equals(user.getId())) {
            throw new RuntimeException("Vous n'êtes pas le chef de ce projet");
        }

        // Créer la tâche
        Tache tache = new Tache();
        tache.setTitre(request.getTitre());
        tache.setDescription(request.getDescription());
        tache.setDateDebut(request.getDateDebut());
        tache.setDateFin(request.getDateFin());
        tache.setStatut(request.getStatut());
        tache.setProjet(projet);

        // Gérer les tâches prédécesseurs
        if (request.getPredecesseursIds() != null && !request.getPredecesseursIds().isEmpty()) {
            Set<Tache> predecesseurs = request.getPredecesseursIds().stream()
                .map(id -> tacheRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tâche prédécesseur non trouvée: " + id)))
                .collect(Collectors.toSet());
            
            // Vérifier que toutes les tâches prédécesseurs appartiennent au même projet
            for (Tache predecesseur : predecesseurs) {
                if (!predecesseur.getProjet().getIdProjet().equals(projet.getIdProjet())) {
                    throw new RuntimeException("La tâche prédécesseur " + predecesseur.getIdTache() + 
                        " n'appartient pas au même projet");
                }
            }
            
            tache.setPredecesseurs(predecesseurs);
        }

        tache = tacheRepository.save(tache);
        tacheLogService.createLog(tache.getIdTache(), "Tâche créée");
        return tache;
    }

    @Override
    @Transactional
    public Tache updateTache(Long idTache, UpdateTacheRequest request, User user) {
        // Vérifier si la tâche existe
        Tache tache = tacheRepository.findById(idTache)
            .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));

        // Vérifier si l'utilisateur est le chef du projet
        Projet projet = tache.getProjet();
        Chef chefProjet = chefRepository.findByProjet(projet)
            .orElseThrow(() -> new RuntimeException("Aucun chef n'est assigné à ce projet"));

        if (!chefProjet.getChef().getId().equals(user.getId())) {
            throw new RuntimeException("Vous n'êtes pas le chef de ce projet");
        }

        // Mise à jour des champs
        tache.setTitre(request.getTitre());
        tache.setDescription(request.getDescription());
        tache.setDateDebut(request.getDateDebut());
        tache.setDateFin(request.getDateFin());
        tache.setStatut(request.getStatut());

        tache = tacheRepository.save(tache);
        tacheLogService.createLog(idTache, "Tâche mise à jour");
        return tache;
    }

    @Override
    @Transactional
    public Tache updateTacheStatut(Long idTache, UpdateTacheStatutRequest request, User user) {
        // Vérifier si la tâche existe
        Tache tache = tacheRepository.findById(idTache)
            .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));

        // Vérifier si l'utilisateur est affecté à cette tâche
        Affectation affectation = affectationRepository.findByTacheAndMembre(tache, user)
            .orElseThrow(() -> new RuntimeException("Vous n'êtes pas affecté à cette tâche"));

        // Mise à jour du statut
        tache.setStatut(request.getStatut());

        tache = tacheRepository.save(tache);
        tacheLogService.createLog(idTache, "Statut de la tâche mis à jour : " + request.getStatut());
        return tache;
    }

    @Override
    @Transactional
    public Tache updateTacheProgression(Long idTache, UpdateTacheProgressionRequest request, User user) {
        // Vérifier si la tâche existe
        Tache tache = tacheRepository.findById(idTache)
            .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));

        // Vérifier si l'utilisateur est affecté à cette tâche
        Affectation affectation = affectationRepository.findByTacheAndMembre(tache, user)
            .orElseThrow(() -> new RuntimeException("Vous n'êtes pas affecté à cette tâche"));

        // Vérifier que la progression est entre 0 et 100
        if (request.getProgression() < 0 || request.getProgression() > 100) {
            throw new RuntimeException("La progression doit être comprise entre 0 et 100");
        }

        // Mise à jour de la progression
        tache.setProgression(request.getProgression());

        // Si la progression atteint 100%, mettre le statut à TERMINE
        if (request.getProgression() == 100) {
            tache.setStatut("TERMINE");
        }

        tache = tacheRepository.save(tache);
        tacheLogService.createLog(idTache, "Progression de la tâche mise à jour : " + request.getProgression() + "%");
        return tache;
    }

    // @Override
    // @Transactional
    // public void deleteTache(Long id) {
    //     Tache tache = tacheRepository.findById(id)
    //         .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));
    //     tacheLogService.createLog(id, "Tâche supprimée");
    //     tacheRepository.delete(tache);
    // }
} 
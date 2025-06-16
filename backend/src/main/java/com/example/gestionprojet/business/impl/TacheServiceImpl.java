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
import com.example.gestionprojet.dao.repository.UserRepository;
import com.example.gestionprojet.exception.BusinessException;
import com.example.gestionprojet.web.dto.CreateTacheRequest;
import com.example.gestionprojet.web.dto.UpdateTacheRequest;
import com.example.gestionprojet.web.dto.UpdateTacheStatutRequest;
import com.example.gestionprojet.web.dto.UpdateTacheProgressionRequest;
import com.example.gestionprojet.web.dto.TacheResponseDto;
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
    private final TacheLogService tacheLogService;
    private final UserRepository userRepository;

    @Override
    public List<TacheResponseDto> getTachesByProjet(Long idProjet) {
        Projet projet = projetRepository.findById(idProjet)
            .orElseThrow(() -> new BusinessException("Projet non trouvé"));
        List<Tache> taches = tacheRepository.findByProjet(projet);
        
        return taches.stream().map(tache -> {
            User assigne = affectationRepository.findByTache(tache)
                                              .map(Affectation::getMembre)
                                              .orElse(null);
            return TacheResponseDto.fromEntity(tache, assigne);
        }).collect(Collectors.toList());
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
        tache.setProgression(request.getProgression());
        tache.setPriorite(request.getPriorite());
        tache.setProjet(projet);

        // Gérer les tags
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            tache.setTags(request.getTags());
        }

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

        // Si une affectation est fournie dans la requête, l'enregistrer
        if (request.getAssigneId() != null) {
            User assignedUser = userRepository.findById(request.getAssigneId())
                .orElseThrow(() -> new RuntimeException("Membre assigné non trouvé"));
            Affectation affectation = new Affectation();
            affectation.setTache(tache);
            affectation.setMembre(assignedUser);
            affectation.setProjet(projet);
            affectationRepository.save(affectation);
        }
        tacheLogService.createLog(tache.getIdTache(), "Tâche créée");
        return tache;
    }

    @Override
    @Transactional
    public Tache updateTache(Long idTache, UpdateTacheRequest request, User user) {
        Tache tache = tacheRepository.findById(idTache)
            .orElseThrow(() -> new BusinessException("Tâche non trouvée"));

        // Vérifier si l'utilisateur est le chef du projet ou le membre assigné
        Projet projet = tache.getProjet();
        Chef chefProjet = chefRepository.findByProjet(projet)
            .orElseThrow(() -> new RuntimeException("Aucun chef n'est assigné à ce projet"));

        boolean isChef = chefProjet.getChef().getId().equals(user.getId());
        boolean isAssignedMember = affectationRepository.findByTacheAndMembre(tache, user).isPresent();

        if (!isChef && !isAssignedMember) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier cette tâche");
        }

        tache.setTitre(request.getTitre());
        tache.setDescription(request.getDescription());
        tache.setDateDebut(request.getDateDebut());
        tache.setDateFin(request.getDateFin());
        tache.setStatut(request.getStatut());
        tache.setPriorite(request.getPriorite());

        // Gérer les tags
        if (request.getTags() != null) {
            tache.setTags(request.getTags());
        }

        if (request.getPredecesseursIds() != null) {
            Set<Tache> predecesseurs = request.getPredecesseursIds().stream()
                .map(id -> tacheRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Tâche prédécesseur non trouvée: " + id)))
                .collect(Collectors.toSet());
            tache.setPredecesseurs(predecesseurs);
        }

        tacheLogService.createLog(tache.getIdTache(), "Tâche mise à jour");
        return tacheRepository.save(tache);
    }

    @Override
    @Transactional
    public Tache updateTacheStatut(Long idTache, UpdateTacheStatutRequest request, User user) {
        Tache tache = tacheRepository.findById(idTache)
            .orElseThrow(() -> new BusinessException("Tâche non trouvée"));
        
        Projet projet = tache.getProjet();
        Chef chefProjet = chefRepository.findByProjet(projet)
            .orElseThrow(() -> new RuntimeException("Aucun chef n'est assigné à ce projet"));

        boolean isChef = chefProjet.getChef().getId().equals(user.getId());
        boolean isAssignedMember = affectationRepository.findByTacheAndMembre(tache, user).isPresent();

        if (!isChef && !isAssignedMember) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier le statut de cette tâche");
        }

        tache.setStatut(request.getStatut());
        tacheLogService.createLog(tache.getIdTache(), "Statut de la tâche mis à jour: " + request.getStatut());
        return tacheRepository.save(tache);
    }

    @Override
    @Transactional
    public Tache updateTacheProgression(Long idTache, UpdateTacheProgressionRequest request, User user) {
        Tache tache = tacheRepository.findById(idTache)
            .orElseThrow(() -> new BusinessException("Tâche non trouvée"));

        Projet projet = tache.getProjet();
        Chef chefProjet = chefRepository.findByProjet(projet)
            .orElseThrow(() -> new RuntimeException("Aucun chef n'est assigné à ce projet"));

        boolean isChef = chefProjet.getChef().getId().equals(user.getId());
        boolean isAssignedMember = affectationRepository.findByTacheAndMembre(tache, user).isPresent();

        if (!isChef && !isAssignedMember) {
            throw new RuntimeException("Vous n'êtes pas autorisé à modifier la progression de cette tâche");
        }

        tache.setProgression(request.getProgression());
        tacheLogService.createLog(tache.getIdTache(), "Progression de la tâche mise à jour: " + request.getProgression() + "%");
        return tacheRepository.save(tache);
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
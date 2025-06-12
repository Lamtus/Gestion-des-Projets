package com.example.gestionprojet.business.impl;

import com.example.gestionprojet.business.service.AffectationService;
import com.example.gestionprojet.business.service.NotificationService;
import com.example.gestionprojet.dao.model.Affectation;
import com.example.gestionprojet.dao.model.Chef;
import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.model.Tache;
import com.example.gestionprojet.dao.model.TacheLog;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.dao.repository.AffectationRepository;
import com.example.gestionprojet.dao.repository.ChefRepository;
import com.example.gestionprojet.dao.repository.TacheLogRepository;
import com.example.gestionprojet.dao.repository.TacheRepository;
import com.example.gestionprojet.dao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AffectationServiceImpl implements AffectationService {
    private final AffectationRepository affectationRepository;
    private final TacheRepository tacheRepository;
    private final UserRepository userRepository;
    private final ChefRepository chefRepository;
    private final NotificationService notificationService;
    private final TacheLogRepository tacheLogRepository;

    @Override
    @Transactional
    public Affectation affecterTache(Long idTache, Long idMembre, User user) {
        // Vérifier si la tâche existe
        Tache tache = tacheRepository.findById(idTache)
            .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));

        // Vérifier si le membre existe
        User membre = userRepository.findById(idMembre)
            .orElseThrow(() -> new RuntimeException("Membre non trouvé"));

        // Vérifier si l'utilisateur est le chef du projet
        Projet projet = tache.getProjet();
        Chef chefProjet = chefRepository.findByProjet(projet)
            .orElseThrow(() -> new RuntimeException("Aucun chef n'est assigné à ce projet"));

        if (!chefProjet.getChef().getId().equals(user.getId())) {
            throw new RuntimeException("Vous n'êtes pas le chef de ce projet");
        }

        // Créer l'affectation
        Affectation affectation = new Affectation();
        affectation.setTache(tache);
        affectation.setMembre(membre);
        affectationRepository.save(affectation);

        // Créer la notification
        notificationService.createNotification(membre, "Vous avez été assigné à la tâche : " + tache.getTitre());

        // Créer le log
        TacheLog log = new TacheLog();
        log.setMessage("Tâche assignée à " + membre.getNom() + " " + membre.getPrenom());
        log.setTache(tache);
        tacheLogRepository.save(log);

        return affectation;
    }

    @Override
    public List<Tache> getTachesByMembre(User user) {
        return affectationRepository.findByMembre(user).stream()
                .map(Affectation::getTache)
                .collect(Collectors.toList());
    }
}

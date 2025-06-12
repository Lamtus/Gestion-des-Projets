package com.example.gestionprojet.business.impl;

import com.example.gestionprojet.business.service.ChefService;
import com.example.gestionprojet.business.service.ProjetLogService;
import com.example.gestionprojet.business.service.ProjetService;
import com.example.gestionprojet.web.dto.CreateProjetRequest;
import com.example.gestionprojet.web.dto.UpdateProjetRequest;
import com.example.gestionprojet.web.dto.ChangeChefProjetRequest;
import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.model.Role;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.dao.repository.ProjetsRepository;
import com.example.gestionprojet.dao.repository.UserRepository;
import com.example.gestionprojet.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.gestionprojet.dao.repository.ChefRepository;
import com.example.gestionprojet.web.dto.ProjetResponse;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjetServiceImpl implements ProjetService {
    private final ProjetsRepository projetsRepository;
    private final UserRepository userRepository;
    private final ChefService chefService;
    private final ProjetLogService projetLogService;
    private final ChefRepository chefRepository;

    @Override
    public Projet getProjetById(Long idProjet) {
        return projetsRepository.findById(idProjet)
                .orElseThrow(() -> new BusinessException("Projet non trouvé"));
    }

    @Override
    @Transactional
    public Projet addProjet(CreateProjetRequest request, User user) {
        // Vérifier si l'utilisateur est un directeur
        if (user.getRole() != Role.DIRECTEUR) {
            throw new BusinessException("Seul un directeur peut créer un projet");
        }

        // Vérifier si le titre existe déjà
        if (projetsRepository.existsByTitre(request.getName())) {
            throw new BusinessException("Un projet avec ce titre existe déjà");
        }

        // Vérifier si le chef de projet existe
        User chefProjet = userRepository.findById(request.getManagerId())
                .orElseThrow(() -> new BusinessException("Chef de projet non trouvé"));

        // Créer le projet
        Projet projet = new Projet();
        projet.setTitre(request.getName());
        projet.setDescription(request.getDescription());
        projet.setDateDebut(request.getStartDate());
        projet.setDateFin(request.getEndDate());
        projet.setStatut(request.getStatus());
        projet.setBudget(request.getBudget());
        projet.setCategory(request.getCategory());
        projet.setPriority(request.getPriority());
        projet.setDirecteur(user); // Définir le directeur qui crée le projet

        // Sauvegarder le projet
        projet = projetsRepository.save(projet);
        

        // Créer l'affectation du chef de projet
        chefService.assignChefToProjet(projet, chefProjet);

        // Créer un log pour la création du projet
        projetLogService.createLog(projet.getIdProjet(), 
            String.format("Projet créé par %s %s", user.getPrenom(), user.getNom()));

        return projet;
    }

    @Override
    @Transactional
    public Projet updateProjet(Long idProjet, UpdateProjetRequest request, User user) {
        if (user.getRole() != Role.DIRECTEUR) {
            throw new BusinessException("Seul un directeur peut modifier un projet");
        }

        Projet projet = projetsRepository.findById(idProjet)
            .orElseThrow(() -> new BusinessException("Projet non trouvé"));

        // Vérifier si le nouveau titre existe déjà (sauf pour le projet actuel)
        if (!projet.getTitre().equals(request.getTitre()) && 
            projetsRepository.existsByTitre(request.getTitre())) {
            throw new BusinessException("Un projet avec ce titre existe déjà");
        }

        projet.setTitre(request.getTitre());
        projet.setDescription(request.getDescription());
        projet.setDateDebut(request.getDateDebut());
        projet.setDateFin(request.getDateFin());
        projet.setStatut(request.getStatut());

        projet = projetsRepository.save(projet);

        // Créer un log pour la mise à jour
        projetLogService.createLog(projet.getIdProjet(), 
            String.format("Projet mis à jour par %s %s", user.getPrenom(), user.getNom()));

        return projet;
    }

    @Override
    @Transactional
    public Projet changeChefProjet(Long idProjet, ChangeChefProjetRequest request, User user) {
        if (user.getRole() != Role.DIRECTEUR) {
            throw new BusinessException("Seul un directeur peut changer le chef de projet");
        }

        Projet projet = projetsRepository.findById(idProjet)
            .orElseThrow(() -> new BusinessException("Projet non trouvé"));

        User nouveauChef = userRepository.findById(request.getNouveauChefId())
            .orElseThrow(() -> new BusinessException("Nouveau chef de projet introuvable"));

        // Supprimer l'ancien chef
        chefService.removeChefFromProjet(projet);
        
        // Assigner le nouveau chef
        chefService.assignChefToProjet(projet, nouveauChef);

        // Créer un log pour le changement de chef
        projetLogService.createLog(projet.getIdProjet(), 
            String.format("Chef de projet changé - Nouveau chef : %s %s par %s %s", 
                nouveauChef.getPrenom(), nouveauChef.getNom(),
                user.getPrenom(), user.getNom()));

        return projet;
    }

    @Override
    public List<ProjetResponse> getProjetsByDirecteur(User directeur) {
        List<Projet> projets = projetsRepository.findByDirecteur(directeur);
        return projets.stream().map(projet -> {
            User chefProjet = chefRepository.findByProjet(projet).map(chef -> chef.getChef()).orElse(null);
            return ProjetResponse.builder()
                    .idProjet(projet.getIdProjet())
                    .titre(projet.getTitre())
                    .description(projet.getDescription())
                    .statut(projet.getStatut())
                    .dateDebut(projet.getDateDebut())
                    .dateFin(projet.getDateFin())
                    .directeur(projet.getDirecteur())
                    .chefProjet(chefProjet)
                    .build();
        }).collect(Collectors.toList());
    }

    // @Override
    // @Transactional
    // public void deleteProjet(Long id) {
    //     Projet projet = getProjetById(id);
    //     projetLogService.createLog(id, "Projet supprimé");
    //     projetsRepository.delete(projet);
    // }
}

package com.example.gestionprojet.business.impl;

import com.example.gestionprojet.business.service.ChefService;
import com.example.gestionprojet.dao.model.Chef;
import com.example.gestionprojet.dao.model.Projet;
import com.example.gestionprojet.dao.model.User;
import com.example.gestionprojet.dao.repository.ChefRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChefServiceImpl implements ChefService {
    private final ChefRepository chefRepository;

    @Override
    @Transactional
    public Chef assignChefToProjet(Projet projet, User chef) {
        Chef chefProjet = new Chef();
        chefProjet.setProjet(projet);
        chefProjet.setChef(chef);
        return chefRepository.save(chefProjet);
    }

    @Override
    @Transactional
    public void removeChefFromProjet(Projet projet) {
        chefRepository.deleteByProjet(projet);
    }
}

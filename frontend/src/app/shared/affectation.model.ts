import { Projet } from './projet.model';
import { Tache } from './tache.model';
import { User } from './user.model';

export interface Affectation {
    idAffectation: number;
    projet: Projet;
    tache: Tache;
    membre: User;
} 
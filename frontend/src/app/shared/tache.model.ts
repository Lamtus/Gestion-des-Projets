import { Projet } from './projet.model';
import { User } from './user.model';

export interface Tache {
    idTache: number;
    titre: string;
    description: string;
    dateDebut: Date;
    dateFin: Date;
    statut: string;
    progression: number;
    priorite: string;
    projet: Projet;
    assigne: User;
    predecesseurs: Tache[];
} 
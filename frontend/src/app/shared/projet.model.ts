import { User } from './user.model';

export interface Projet {
    idProjet: number;
    titre: string;
    description: string;
    statut: string;
    dateDebut: Date;
    dateFin: Date;
    directeur: User;
    chefProjet: User;
} 
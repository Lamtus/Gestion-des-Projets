import { Projet } from './projet.model';
import { User } from './user.model';

export interface Chef {
    idChef: number;
    projet: Projet;
    chef: User;
} 
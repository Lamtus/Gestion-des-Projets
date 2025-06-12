import { User } from './user.model';
import { Tache } from './tache.model';

export interface Erreur {
    idErreur: number;
    message: string;
    membre: User;
    tache: Tache;
} 
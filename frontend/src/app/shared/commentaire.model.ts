import { User } from './user.model';
import { Tache } from './tache.model';

export interface Commentaire {
    idCommentaire: number;
    contenu: string;
    membre: User;
    tache: Tache;
} 
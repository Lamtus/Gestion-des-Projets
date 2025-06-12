import { User } from './user.model';

export interface Historique {
    id: number;
    action: string;
    description: string;
    dateAction: Date;
    userId: number;
    projetId?: number;
    tacheId?: number;
    commentaireId?: number;
    errorId?: number;
} 
import { Tache } from './tache.model';

export interface TacheLog {
    idLog: number;
    tache: Tache;
    message: string;
    dateCreation: Date;
} 
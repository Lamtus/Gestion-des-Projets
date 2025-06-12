import { Projet } from './projet.model';

export interface ProjetLog {
    idLog: number;
    projet: Projet;
    message: string;
    dateCreation: Date;
} 
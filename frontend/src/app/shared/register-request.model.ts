import { Role } from "./user.model";

export interface RegisterRequest {
    nom: string;
    prenom: string;
    email: string;
    password?: string; // Password is optional on the form, but will be generated
    telephone: string;
    poste: string;
    departement: string;
    role: Role;
} 
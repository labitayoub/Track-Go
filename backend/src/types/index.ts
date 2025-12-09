import type { Request } from 'express';

export interface IUser {
  _id: string;
  nom: string;
  email: string;
  password: string;
  role: 'admin' | 'chauffeur';
  telephone?: string;
  createdAt: Date;
}

export interface ICamion {
  _id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  kilometrage: number;
  statut: 'disponible' | 'en_service' | 'maintenance';
  derniereMaintenance?: Date;
  prochaineMaintenance?: Date;
  createdAt: Date;
}

export interface IRemorque {
  _id: string;
  immatriculation: string;
  type: string;
  capacite: number;
  statut: 'disponible' | 'en_service' | 'maintenance';
  createdAt: Date;
}

export interface IPneu {
  _id: string;
  reference: string;
  marque: string;
  position: string;
  camionId?: string;
  remorqueId?: string;
  usure: number;
  pressionRecommandee: number;
  dateInstallation: Date;
  kilometrageInstallation: number;
  statut: 'bon' | 'moyen' | 'usé' | 'à_remplacer';
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

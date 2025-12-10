import mongoose, { Schema, Document } from 'mongoose';

export interface ICamion extends Document {
    immatriculation: string;
    marque: string;
    modele: string;
    annee: number;
    kilometrage: number;
    capaciteCarburant: number;
    statut: 'disponible' | 'en_mission' | 'maintenance';
    derniereMaintenance?: Date;
    prochaineMaintenance?: Date;
}

const camionSchema = new Schema<ICamion>({
    immatriculation: { type: String, required: true, unique: true },
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    annee: { type: Number, required: true },
    kilometrage: { type: Number, default: 0 },
    capaciteCarburant: { type: Number, required: true },
    statut: { 
        type: String, 
        enum: ['disponible', 'en_mission', 'maintenance'], 
        default: 'disponible' 
    },
    derniereMaintenance: Date,
    prochaineMaintenance: Date
}, { timestamps: true });

export const camionModel = mongoose.model<ICamion>('Camion', camionSchema);
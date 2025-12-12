import mongoose, { Schema, Document } from 'mongoose';

export interface ICamion extends Document {
    immatriculation: string;
    marque: string;
    modele: string;
    annee: number;
    kilometrage: number;
    statut: 'disponible' | 'en_mission' | 'maintenance';
}

const camionSchema = new Schema<ICamion>({
    immatriculation: { type: String, required: true, unique: true },
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    annee: { type: Number, required: true },
    kilometrage: { type: Number, default: 0 },
    statut: { 
        type: String, 
        enum: ['disponible', 'en_mission', 'maintenance'], 
        default: 'disponible' 
    }
}, { timestamps: true });

export const camionModel = mongoose.model<ICamion>('Camion', camionSchema);
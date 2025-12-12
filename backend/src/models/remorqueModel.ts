import mongoose, { Schema, Document } from 'mongoose';

export interface IRemorque extends Document {
    immatriculation: string;
    type: string;
    capacite: number;
    statut: 'disponible' | 'en_mission' | 'maintenance';
}

const remorqueSchema = new Schema<IRemorque>({
    immatriculation: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    capacite: { type: Number, required: true },
    statut: { 
        type: String, 
        enum: ['disponible', 'en_mission', 'maintenance'], 
        default: 'disponible' 
    }
}, { timestamps: true });

export const remorqueModel = mongoose.model<IRemorque>('Remorque', remorqueSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IPneu extends Document {
    vehiculeId: mongoose.Types.ObjectId;
    vehiculeType: 'camion' | 'remorque';
    position: string;
    marque: string;
    kmInstallation: number;
    kmLimite: number;
    statut: 'bon' | 'use' | 'critique';
}

const pneuSchema = new Schema<IPneu>({
    vehiculeId: { type: Schema.Types.ObjectId, required: true, refPath: 'vehiculeType' },
    vehiculeType: { 
        type: String, 
        enum: ['camion', 'remorque'], 
        required: true 
    },
    position: { type: String, required: true },
    marque: { type: String, required: true },
    kmInstallation: { type: Number, required: true },
    kmLimite: { type: Number, required: true },
    statut: { 
        type: String, 
        enum: ['bon', 'use', 'critique'], 
        default: 'bon' 
    }
}, { timestamps: true });

// Index composé pour éviter les doublons position/véhicule
pneuSchema.index({ vehiculeId: 1, position: 1 }, { unique: true });

export const pneuModel = mongoose.model<IPneu>('Pneu', pneuSchema);
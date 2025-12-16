import mongoose, { Schema, Document } from 'mongoose';

export interface IMaintenanceRule extends Document {
    nom: string;
    type: 'vidange' | 'pneus' | 'revision' | 'gasoil';
    seuilKm: number;
    alerteAvantKm: number;
    actif: boolean;
}

const maintenanceRuleSchema = new Schema<IMaintenanceRule>({
    nom: { type: String, required: true, unique: true },
    type: { type: String, enum: ['vidange', 'pneus', 'revision', 'gasoil'], required: true },
    seuilKm: { type: Number, required: true },
    alerteAvantKm: { type: Number, default: 500 },
    actif: { type: Boolean, default: true }
}, { timestamps: true });

export const maintenanceRuleModel = mongoose.model<IMaintenanceRule>('MaintenanceRule', maintenanceRuleSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IMaintenance extends Document {
    camionId: mongoose.Types.ObjectId;
    type: 'vidange' | 'revision' | 'pneus' | 'reparation';
    description: string;
    datePrevue: Date;
    dateRealisee?: Date;
    cout?: number;
    statut: 'planifiee' | 'en_cours' | 'terminee';
    kilometrage?: number;
}

const maintenanceSchema = new Schema<IMaintenance>({
    camionId: { type: Schema.Types.ObjectId, ref: 'Camion', required: true },
    type: { 
        type: String, 
        enum: ['vidange', 'revision', 'pneus', 'reparation'], 
        required: true 
    },
    description: { type: String, required: true },
    datePrevue: { type: Date, required: true },
    dateRealisee: Date,
    cout: Number,
    statut: { 
        type: String, 
        enum: ['planifiee', 'en_cours', 'terminee'], 
        default: 'planifiee' 
    },
    kilometrage: Number
}, { timestamps: true });

export const maintenanceModel = mongoose.model<IMaintenance>('Maintenance', maintenanceSchema);
import mongoose, { Schema, Document } from 'mongoose';

export interface IMaintenance extends Document {
    camionId?: mongoose.Types.ObjectId;
    remorqueId?: mongoose.Types.ObjectId;
    type: 'vidange' | 'pneus' | 'revision' | 'reparation' | 'gasoil';
    description: string;
    datePrevue: Date;
    dateRealisee?: Date;
    cout?: number;
    statut: 'planifiee' | 'terminee';
}

const maintenanceSchema = new Schema<IMaintenance>({
    camionId: { type: Schema.Types.ObjectId, ref: 'Camion' },
    remorqueId: { type: Schema.Types.ObjectId, ref: 'Remorque' },
    type: {
        type: String,
        enum: ['vidange', 'pneus', 'revision', 'reparation', 'gasoil'],
        required: true
    },
    description: { type: String, required: true },
    datePrevue: { type: Date, required: true },
    dateRealisee: Date,
    cout: Number,
    statut: {
        type: String,
        enum: ['planifiee', 'terminee'],
        default: 'planifiee'
    }
}, { timestamps: true });

export const maintenanceModel = mongoose.model<IMaintenance>('Maintenance', maintenanceSchema);
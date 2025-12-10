import mongoose, { Schema, Document } from 'mongoose';

export interface ITrajet extends Document {
    chauffeurId: mongoose.Types.ObjectId;
    camionId: mongoose.Types.ObjectId;
    remorqueId?: mongoose.Types.ObjectId;
    pointDepart: string;
    pointArrivee: string;
    dateDepart: Date;
    dateArrivee?: Date;
    kilometrageDepart?: number;
    kilometrageArrivee?: number;
    carburantDepart?: number;
    carburantArrivee?: number;
    statut: 'a_faire' | 'en_cours' | 'termine';
    remarques?: string;
}

const trajetSchema = new Schema<ITrajet>({
    chauffeurId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    camionId: { type: Schema.Types.ObjectId, ref: 'Camion', required: true },
    remorqueId: { type: Schema.Types.ObjectId, ref: 'Remorque' },
    pointDepart: { type: String, required: true },
    pointArrivee: { type: String, required: true },
    dateDepart: { type: Date, required: true },
    dateArrivee: Date,
    kilometrageDepart: Number,
    kilometrageArrivee: Number,
    carburantDepart: Number,
    carburantArrivee: Number,
    statut: { 
        type: String, 
        enum: ['a_faire', 'en_cours', 'termine'], 
        default: 'a_faire' 
    },
    remarques: String
}, { timestamps: true });

export const trajetModel = mongoose.model<ITrajet>('Trajet', trajetSchema);
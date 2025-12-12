import mongoose, { Schema, Document } from 'mongoose';

export interface ITrajet extends Document {
    chauffeurId: mongoose.Types.ObjectId;
    camionId: mongoose.Types.ObjectId;
    remorqueId?: mongoose.Types.ObjectId;
    depart: string;
    arrivee: string;
    dateDepart: Date;
    dateArrivee?: Date;
    kmDepart: number;
    kmArrivee?: number;
    gasoil?: number;
    statut: 'a_faire' | 'en_cours' | 'termine';
    remarques?: string;
}

const trajetSchema = new Schema<ITrajet>({
    chauffeurId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    camionId: { type: Schema.Types.ObjectId, ref: 'Camion', required: true },
    remorqueId: { type: Schema.Types.ObjectId, ref: 'Remorque' },
    depart: { type: String, required: true },
    arrivee: { type: String, required: true },
    dateDepart: { type: Date, required: true },
    dateArrivee: Date,
    kmDepart: { type: Number, required: true },
    kmArrivee: Number,
    gasoil: Number,
    statut: { 
        type: String, 
        enum: ['a_faire', 'en_cours', 'termine'], 
        default: 'a_faire' 
    },
    remarques: String
}, { timestamps: true });

export const trajetModel = mongoose.model<ITrajet>('Trajet', trajetSchema);
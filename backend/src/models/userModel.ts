import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    nom: string;
    email: string;
    password: string;
    role: 'admin' | 'chauffeur';
    telephone: string;
    isActive?: boolean;
}

const userSchema = new Schema<IUser>({
    nom: { type: String, 
        required: true },
    email: { type: String, 
        required: true, 
        unique: true },
    role: { type: String, 
        enum: ['admin', 'chauffeur'], 
        required: true },
    telephone: { type: String,
        required: true },
    password: { type: String,
        required: true
     },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true});

export const userModel = mongoose.model<IUser>('User', userSchema);
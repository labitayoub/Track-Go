import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { userModel } from '../models/userModel.js';

dotenv.config();

const adminUser = {
    nom: 'Ayoub labit',
    email: 'ayoub@trackgo.com',
    password: 'password',
    role: 'admin',
    telephone: '0600000000',
    isActive: true
};

const seedAdmin = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/track_go');
        console.log('MongoDB connecté');

        // Vérifier si l'admin existe déjà
        const existingAdmin = await userModel.findOne({ email: adminUser.email });
        
        if (existingAdmin) {
            console.log('Admin existe déjà:', adminUser.email);
        } else {
            // Hasher le password
            const hashedPassword = await bcrypt.hash(adminUser.password, 10);
            
            // Créer l'admin
            const admin = new userModel({
                ...adminUser,
                password: hashedPassword
            });
            
            await admin.save();
            console.log('  Admin créé avec succès!');
            console.log('   Email:', adminUser.email);
            console.log('   Password:', adminUser.password);
        }

        await mongoose.disconnect();
        console.log(' Déconnexion MongoDB');
        process.exit(0);
    } catch (error) {
        console.error(' Erreur:', error);
        process.exit(1);
    }
};

seedAdmin();

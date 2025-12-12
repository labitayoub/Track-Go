import { error } from "console";
import {userModel} from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface RegisterParams {
    nom: string;
    email: string;
    password: string;
    role: 'admin' | 'chauffeur';
    telephone: string;
}

interface RegisterInput {
    nom: string;
    email: string;
    password: string;
    telephone: string;
}

export const register = async ({nom, email, password, role, telephone}: RegisterParams)=> {
    const findUser = await userModel.findOne({ email })
    if(findUser){
        return {error: {message: "User already exists"}}
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
        nom,
        email,
        password: hashedPassword,
        role: 'chauffeur', // Toujours chauffeur lors du register
        telephone,
        isActive: false // Attend activation admin
    })
    await newUser.save()
    return newUser
}

interface LoginParams {
    email: string;
    password: string;
}

export const login = async ({email, password}: LoginParams) => {
    const findUser = await userModel.findOne({ email })
    if(!findUser){
        return {error: {message: "User not found"}}
    }
    
    if(!findUser.isActive){
        return {error: {message: "Account not activated. Please wait for admin approval."}}
    }
    
    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if(passwordMatch){
        const token = jwt.sign({ id: findUser._id, role: findUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        return { user: findUser, token }
    }

    return {error: {message: "Incorrect password"}}
}

export const activateUser = async (userId: string) => {
    try {
        const user = await userModel.findByIdAndUpdate(
            userId, 
            { isActive: true }, 
            { new: true }
        );
        if (!user) {
            return { error: { message: "User not found" } };
        }
        return { user, message: "User activated successfully" };
    } catch (error) {
        return { error: { message: "Error activating user" } };
    }
}

export const getPendingUsers = async () => {
    try {
        const users = await userModel.find({ isActive: false, role: 'chauffeur' }).select('-password');
        return users;
    } catch (error) {
        return { error: { message: "Error fetching pending users" } };
    }
}

// Récupérer tous les chauffeurs
export const getAllChauffeurs = async () => {
    const chauffeurs = await userModel.find({ role: 'chauffeur' }).select('-password');
    return chauffeurs;
}

// Récupérer les chauffeurs disponibles (pas en trajet actif)
export const getAvailableChauffeurs = async () => {
    const { getActiveTrajetResources } = await import('./trajetService.js');
    const { chauffeurIds } = await getActiveTrajetResources();
    return userModel.find({ 
        role: 'chauffeur',
        isActive: true,
        _id: { $nin: chauffeurIds }
    }).select('-password');
}

// Activer/Désactiver un utilisateur
export const toggleUserStatus = async (userId: string) => {
    const user = await userModel.findById(userId);
    if (!user) {
        return { error: { message: "User not found" } };
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    return { 
        user: { ...user.toObject(), password: undefined },
        message: user.isActive ? "Chauffeur activé" : "Chauffeur désactivé"
    };
}
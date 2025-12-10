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
        role,
        telephone,
        isActive: true
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
    
    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if(passwordMatch){
        const token = jwt.sign({ id: findUser._id, role: findUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        return { user: findUser, token }
    }

    return {error: {message: "Incorrect password"}}
}
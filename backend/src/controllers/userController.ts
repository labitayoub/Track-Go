import type { Request, Response } from "express";
import { register, login, getAllChauffeurs, toggleUserStatus } from "../services/userService.js";
import { registerSchema, loginSchema } from "../validators/userValidator.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";

export const registerController = async (req: Request, res: Response) => {
    try {
        // Validation Joi
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const result = await register(value);

        if ('error' in result) {
            return res.status(400).json(result.error);
        }

        res.status(201).json({ 
            message: "Chauffeur registered successfully. Waiting for admin activation.", 
            user: { ...result.toObject(), password: undefined } 
        });
    } catch (error) {
        console.error("Erreur dans registerController:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        // Validation Joi
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const result = await login(value);

        if ('error' in result) {
            return res.status(400).json(result.error);
        }

        res.status(200).json({ message: "Login successful", user: result.user, token: result.token });
    } catch (error) {
        console.error("Erreur dans loginController:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Récupérer tous les chauffeurs (admin only)
export const getChauffeursController = async (req: AuthRequest, res: Response) => {
    try {
        const chauffeurs = await getAllChauffeurs();
        res.status(200).json({ chauffeurs });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Activer/Désactiver un chauffeur (admin only)
export const toggleStatusController = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "ID requis" });
        }
        
        const result = await toggleUserStatus(id);
        
        if ('error' in result) {
            return res.status(400).json(result.error);
        }
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
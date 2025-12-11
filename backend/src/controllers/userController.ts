import type { Request, Response } from "express";
import { register, login, getAllChauffeurs, toggleUserStatus } from "../services/userService.js";
import { registerSchema, loginSchema } from "../validators/userValidator.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";

// Helper validation
const validate = (schema: any, data: any, res: Response) => {
    const { error, value } = schema.validate(data);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
        return null;
    }
    return value;
};

export const registerController = async (req: Request, res: Response) => {
    try {
        const value = validate(registerSchema, req.body, res);
        if (!value) return;

        const result = await register(value);
        if ('error' in result) return res.status(400).json(result.error);

        res.status(201).json({
            message: "Chauffeur registered successfully. Waiting for admin activation.",
            user: { ...result.toObject(), password: undefined },
        });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const value = validate(loginSchema, req.body, res);
        if (!value) return;

        const result = await login(value);
        if ('error' in result) return res.status(400).json(result.error);

        res.status(200).json({
            message: "Login successful",
            user: result.user,
            token: result.token,
        });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

export const getChauffeursController = async (req: AuthRequest, res: Response) => {
    try {
        const chauffeurs = await getAllChauffeurs();
        res.status(200).json({ chauffeurs });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};

export const toggleStatusController = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID requis" });

        const result = await toggleUserStatus(id);
        if ('error' in result) return res.status(400).json(result.error);

        res.status(200).json(result);
    } catch {
        res.status(500).json({ message: "Server error" });
    }
};
import type { Request, Response } from "express";
import { register, login } from "../services/userService.js";

export const registerController = async (req: Request, res: Response) => {
    try {
        const {nom, email, password, role, telephone} = req.body;

        const result = await register({nom, email, password, role, telephone});

        if ('error' in result) {
            return res.status(400).json(result.error);
        }

        res.status(201).json({ message: "User registered successfully", user: result });
    } catch (error) {
        console.error("Erreur dans registerController:", error);
        res.status(500).json({ message: "Server error", details: error instanceof Error ? error.message : "Unknown error" });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const result = await login({ email, password });

        if ('error' in result) {
            return res.status(400).json(result.error);
        }

        res.status(200).json({ message: "Login successful", user: result.user, token: result.token });
    } catch (error) {
        console.error("Erreur dans loginController:", error);
        res.status(500).json({ message: "Server error", details: error instanceof Error ? error.message : "Unknown error" });
    }
};
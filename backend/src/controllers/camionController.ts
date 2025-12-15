import type { Request, Response } from 'express';
import Joi from 'joi';
import * as camionService from '../services/camionService.js';

const camionSchema = Joi.object({
    immatriculation: Joi.string().required(),
    marque: Joi.string().required(),
    modele: Joi.string().required(),
    annee: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).required(),
    kilometrage: Joi.number().min(0).default(0),
    statut: Joi.string().valid('disponible', 'en_mission', 'maintenance').default('disponible')
});

const validate = (schema: Joi.ObjectSchema, data: object) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        throw { status: 400, message: messages };
    }
    return value;
};

export const createCamionController = async (req: Request, res: Response) => {
    try {
        const data = validate(camionSchema, req.body);
        const camion = await camionService.createCamion(data);
        res.status(201).json(camion);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Immatriculation déjà existante' });
        }
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getAllCamionsController = async (_req: Request, res: Response) => {
    try {
        const camions = await camionService.getAllCamions();
        res.json(camions);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getAvailableCamionsController = async (_req: Request, res: Response) => {
    try {
        const camions = await camionService.getAvailableCamions();
        res.json(camions);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getCamionByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const camion = await camionService.getCamionById(id);
        if (!camion) return res.status(404).json({ message: 'Camion non trouvé' });
        res.json(camion);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const updateCamionController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const camion = await camionService.updateCamion(id, req.body);
        if (!camion) return res.status(404).json({ message: 'Camion non trouvé' });
        res.json(camion);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Immatriculation déjà existante' });
        }
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const deleteCamionController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const camion = await camionService.deleteCamion(id);
        if (!camion) return res.status(404).json({ message: 'Camion non trouvé' });
        res.json({ message: 'Camion supprimé' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

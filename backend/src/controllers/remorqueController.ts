import type { Request, Response } from 'express';
import Joi from 'joi';
import * as remorqueService from '../services/remorqueService.js';

const remorqueSchema = Joi.object({
    immatriculation: Joi.string().required(),
    type: Joi.string().required(),
    capacite: Joi.number().min(0).required(),
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

export const createRemorqueController = async (req: Request, res: Response) => {
    try {
        const data = validate(remorqueSchema, req.body);
        const remorque = await remorqueService.createRemorque(data);
        res.status(201).json(remorque);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Immatriculation déjà existante' });
        }
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getAllRemorquesController = async (_req: Request, res: Response) => {
    try {
        const remorques = await remorqueService.getAllRemorques();
        res.json(remorques);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getRemorqueByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const remorque = await remorqueService.getRemorqueById(id);
        if (!remorque) return res.status(404).json({ message: 'Remorque non trouvée' });
        res.json(remorque);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const updateRemorqueController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const remorque = await remorqueService.updateRemorque(id, req.body);
        if (!remorque) return res.status(404).json({ message: 'Remorque non trouvée' });
        res.json(remorque);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Immatriculation déjà existante' });
        }
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const deleteRemorqueController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const remorque = await remorqueService.deleteRemorque(id);
        if (!remorque) return res.status(404).json({ message: 'Remorque non trouvée' });
        res.json({ message: 'Remorque supprimée' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

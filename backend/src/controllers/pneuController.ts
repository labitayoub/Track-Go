import type { Request, Response } from 'express';
import Joi from 'joi';
import * as pneuService from '../services/pneuService.js';

const pneuSchema = Joi.object({
    vehiculeId: Joi.string().required(),
    vehiculeType: Joi.string().valid('camion', 'remorque').required(),
    position: Joi.string().required(),
    marque: Joi.string().required(),
    kmInstallation: Joi.number().min(0).required(),
    kmLimite: Joi.number().min(0).required(),
    statut: Joi.string().valid('bon', 'use', 'critique').default('bon')
});

const validate = (schema: Joi.ObjectSchema, data: object) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        throw { status: 400, message: messages };
    }
    return value;
};

export const createPneuController = async (req: Request, res: Response) => {
    try {
        const data = validate(pneuSchema, req.body);
        const pneu = await pneuService.createPneu(data);
        res.status(201).json(pneu);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Position déjà occupée sur ce véhicule' });
        }
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getAllPneusController = async (_req: Request, res: Response) => {
    try {
        const pneus = await pneuService.getAllPneus();
        res.json(pneus);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getPneusByVehiculeController = async (req: Request, res: Response) => {
    try {
        const { vehiculeId, vehiculeType } = req.params;
        if (!vehiculeId || !vehiculeType) return res.status(400).json({ message: 'Params requis' });
        const pneus = await pneuService.getPneusByVehicule(vehiculeId, vehiculeType);
        res.json(pneus);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getPneuByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const pneu = await pneuService.getPneuById(id);
        if (!pneu) return res.status(404).json({ message: 'Pneu non trouvé' });
        res.json(pneu);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const updatePneuController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const pneu = await pneuService.updatePneu(id, req.body);
        if (!pneu) return res.status(404).json({ message: 'Pneu non trouvé' });
        res.json(pneu);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const deletePneuController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const pneu = await pneuService.deletePneu(id);
        if (!pneu) return res.status(404).json({ message: 'Pneu non trouvé' });
        res.json({ message: 'Pneu supprimé' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getCritiquesController = async (_req: Request, res: Response) => {
    try {
        const critiques = await pneuService.getCritiquesPneus();
        res.json(critiques);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};
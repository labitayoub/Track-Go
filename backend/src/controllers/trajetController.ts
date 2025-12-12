import type { Request, Response } from 'express';
import Joi from 'joi';
import * as trajetService from '../services/trajetService.js';

const trajetSchema = Joi.object({
    chauffeurId: Joi.string().required(),
    camionId: Joi.string().required(),
    remorqueId: Joi.string().allow(null, ''),
    depart: Joi.string().required(),
    arrivee: Joi.string().required(),
    dateDepart: Joi.date().required(),
    dateArrivee: Joi.date().allow(null),
    kmDepart: Joi.number().min(0).required(),
    kmArrivee: Joi.number().min(0).allow(null),
    gasoil: Joi.number().min(0).allow(null),
    statut: Joi.string().valid('a_faire', 'en_cours', 'termine').default('a_faire'),
    remarques: Joi.string().allow(null, '')
});

const validate = (schema: Joi.ObjectSchema, data: object) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        throw { status: 400, message: messages };
    }
    return value;
};

export const createTrajetController = async (req: Request, res: Response) => {
    try {
        const data = validate(trajetSchema, req.body);
        const trajet = await trajetService.createTrajet(data);
        res.status(201).json(trajet);
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getAllTrajetsController = async (_req: Request, res: Response) => {
    try {
        const trajets = await trajetService.getAllTrajets();
        res.json(trajets);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getMyTrajetsController = async (req: Request, res: Response) => {
    try {
        const trajets = await trajetService.getTrajetsByChauffeur((req as any).user.id);
        res.json(trajets);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getTrajetByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const trajet = await trajetService.getTrajetById(id);
        if (!trajet) return res.status(404).json({ message: 'Trajet non trouvé' });
        res.json(trajet);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const updateTrajetController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const trajet = await trajetService.updateTrajet(id, req.body);
        if (!trajet) return res.status(404).json({ message: 'Trajet non trouvé' });
        res.json(trajet);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const deleteTrajetController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const trajet = await trajetService.deleteTrajet(id);
        if (!trajet) return res.status(404).json({ message: 'Trajet non trouvé' });
        res.json({ message: 'Trajet supprimé' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

import type { Request, Response } from 'express';
import Joi from 'joi';
import * as maintenanceService from '../services/maintenanceService.js';

const maintenanceSchema = Joi.object({
    camionId: Joi.string().required(),
    type: Joi.string().valid('vidange', 'pneus', 'revision', 'reparation').required(),
    description: Joi.string().required(),
    datePrevue: Joi.date().required(),
    dateRealisee: Joi.date().allow(null),
    cout: Joi.number().min(0).allow(null),
    statut: Joi.string().valid('planifiee', 'terminee').default('planifiee')
});

const validate = (schema: Joi.ObjectSchema, data: object) => {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        const messages = error.details.map(d => d.message).join(', ');
        throw { status: 400, message: messages };
    }
    return value;
};

export const createMaintenanceController = async (req: Request, res: Response) => {
    try {
        const data = validate(maintenanceSchema, req.body);
        const maintenance = await maintenanceService.createMaintenance(data);
        res.status(201).json(maintenance);
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getAllMaintenancesController = async (_req: Request, res: Response) => {
    try {
        const maintenances = await maintenanceService.getAllMaintenances();
        res.json(maintenances);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getMaintenancesByCamionController = async (req: Request, res: Response) => {
    try {
        const { camionId } = req.params;
        if (!camionId) return res.status(400).json({ message: 'ID camion requis' });
        const maintenances = await maintenanceService.getMaintenancesByCamion(camionId);
        res.json(maintenances);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const getMaintenanceByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const maintenance = await maintenanceService.getMaintenanceById(id);
        if (!maintenance) return res.status(404).json({ message: 'Maintenance non trouvée' });
        res.json(maintenance);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const updateMaintenanceController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const maintenance = await maintenanceService.updateMaintenance(id, req.body);
        if (!maintenance) return res.status(404).json({ message: 'Maintenance non trouvée' });
        res.json(maintenance);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

export const deleteMaintenanceController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'ID requis' });
        const maintenance = await maintenanceService.deleteMaintenance(id);
        if (!maintenance) return res.status(404).json({ message: 'Maintenance non trouvée' });
        res.json({ message: 'Maintenance supprimée' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

// Get upcoming maintenances (next 7 days)
export const getUpcomingMaintenancesController = async (_req: Request, res: Response) => {
    try {
        const maintenances = await maintenanceService.getUpcomingMaintenances();
        res.json(maintenances);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

// Get overdue maintenances (past due date, not completed)
export const getOverdueMaintenancesController = async (_req: Request, res: Response) => {
    try {
        const maintenances = await maintenanceService.getOverdueMaintenances();
        res.json(maintenances);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

// Get maintenance statistics for dashboard
export const getMaintenanceStatsController = async (_req: Request, res: Response) => {
    try {
        const stats = await maintenanceService.getMaintenanceStats();
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Erreur serveur' });
    }
};

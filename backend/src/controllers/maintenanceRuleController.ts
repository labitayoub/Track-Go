import type { Request, Response } from 'express';
import * as service from '../services/maintenanceRuleService.js';
import { maintenanceRuleSchema, maintenanceRuleUpdateSchema } from '../validators/maintenanceRuleValidator.js';

export const create = async (req: Request, res: Response) => {
    const { error, value } = maintenanceRuleSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json(await service.createRule(value));
};

export const getAll = async (_req: Request, res: Response) => res.json(await service.getAllRules());

export const getById = async (req: Request<{ id: string }>, res: Response) => {
    const rule = await service.getRuleById(req.params.id);
    rule ? res.json(rule) : res.status(404).json({ message: 'Non trouvé' });
};

export const update = async (req: Request<{ id: string }>, res: Response) => {
    const { error, value } = maintenanceRuleUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const rule = await service.updateRule(req.params.id, value);
    rule ? res.json(rule) : res.status(404).json({ message: 'Non trouvé' });
};

export const remove = async (req: Request<{ id: string }>, res: Response) => {
    const rule = await service.deleteRule(req.params.id);
    rule ? res.json({ message: 'Supprimé' }) : res.status(404).json({ message: 'Non trouvé' });
};

export const getAlertes = async (_req: Request, res: Response) => res.json(await service.calculerAlertes());

export const generer = async (_req: Request, res: Response) => res.status(201).json(await service.genererMaintenances());

export const seed = async (_req: Request, res: Response) => {
    await service.seedDefaultRules();
    res.json({ message: 'Règles par défaut créées' });
};

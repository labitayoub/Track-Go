import Joi from 'joi';

export const maintenanceRuleSchema = Joi.object({
    nom: Joi.string().required(),
    type: Joi.string().valid('vidange', 'pneus', 'revision', 'gasoil').required(),
    seuilKm: Joi.number().min(0).required(),
    seuilJours: Joi.number().min(1).required(),
    alerteAvantKm: Joi.number().min(0).default(500),
    alerteAvantJours: Joi.number().min(1).default(7),
    actif: Joi.boolean().default(true)
});

export const maintenanceRuleUpdateSchema = maintenanceRuleSchema.fork(
    ['nom', 'type', 'seuilKm', 'seuilJours'],
    (s) => s.optional()
);

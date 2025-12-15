import Joi from 'joi';

// Pneu validation
export const pneuSchema = Joi.object({
    vehiculeId: Joi.string().required().messages({
        'any.required': 'ID véhicule requis'
    }),
    vehiculeType: Joi.string().valid('camion', 'remorque').required().messages({
        'any.required': 'Type véhicule requis',
        'any.only': 'Type doit être camion ou remorque'
    }),
    position: Joi.string().required().messages({
        'any.required': 'Position requise'
    }),
    marque: Joi.string().required().messages({
        'any.required': 'Marque requise'
    }),
    kmInstallation: Joi.number().min(0).required().messages({
        'any.required': 'Km installation requis'
    }),
    kmLimite: Joi.number().min(0).required().messages({
        'any.required': 'Km limite requis'
    }),
    statut: Joi.string().valid('bon', 'use', 'critique').default('bon')
});

export const pneuUpdateSchema = pneuSchema.fork(
    ['vehiculeId', 'vehiculeType', 'position', 'marque', 'kmInstallation', 'kmLimite'],
    (schema) => schema.optional()
);

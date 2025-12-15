import Joi from 'joi';

// Remorque validation
export const remorqueSchema = Joi.object({
    immatriculation: Joi.string().required().messages({
        'any.required': 'Immatriculation requise'
    }),
    type: Joi.string().required().messages({
        'any.required': 'Type requis'
    }),
    capacite: Joi.number().min(0).required().messages({
        'any.required': 'Capacité requise',
        'number.min': 'Capacité doit être positive'
    }),
    statut: Joi.string().valid('disponible', 'en_mission', 'maintenance').default('disponible')
});

export const remorqueUpdateSchema = remorqueSchema.fork(
    ['immatriculation', 'type', 'capacite'],
    (schema) => schema.optional()
);

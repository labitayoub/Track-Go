import Joi from 'joi';

// Camion validation
export const camionSchema = Joi.object({
    immatriculation: Joi.string().required().messages({
        'any.required': 'Immatriculation requise'
    }),
    marque: Joi.string().required().messages({
        'any.required': 'Marque requise'
    }),
    modele: Joi.string().required().messages({
        'any.required': 'Modèle requis'
    }),
    annee: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required().messages({
        'any.required': 'Année requise',
        'number.min': 'Année invalide'
    }),
    kilometrage: Joi.number().min(0).default(0),
    statut: Joi.string().valid('disponible', 'en_mission', 'maintenance').default('disponible')
});

export const camionUpdateSchema = camionSchema.fork(
    ['immatriculation', 'marque', 'modele', 'annee'],
    (schema) => schema.optional()
);

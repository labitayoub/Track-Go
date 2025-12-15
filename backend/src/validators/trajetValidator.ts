import Joi from 'joi';

// Trajet validation
export const trajetSchema = Joi.object({
    chauffeurId: Joi.string().required().messages({
        'any.required': 'Chauffeur requis'
    }),
    camionId: Joi.string().required().messages({
        'any.required': 'Camion requis'
    }),
    remorqueId: Joi.string().optional(),
    depart: Joi.string().required().messages({
        'any.required': 'Départ requis'
    }),
    arrivee: Joi.string().required().messages({
        'any.required': 'Arrivée requise'
    }),
    dateDepart: Joi.date().required().messages({
        'any.required': 'Date départ requise'
    }),
    dateArrivee: Joi.date().optional(),
    kilometrage: Joi.number().min(0).required().messages({
        'any.required': 'Kilométrage requis'
    }),
    gasoil: Joi.number().min(0).optional(),
    statut: Joi.string().valid('a_faire', 'en_cours', 'termine').default('a_faire'),
    remarques: Joi.string().optional().allow('')
});

export const trajetUpdateSchema = trajetSchema.fork(
    ['chauffeurId', 'camionId', 'depart', 'arrivee', 'dateDepart', 'kilometrage'],
    (schema) => schema.optional()
);

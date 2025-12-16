import Joi from 'joi';

// Maintenance validation
export const maintenanceSchema = Joi.object({
    camionId: Joi.string().optional(),
    remorqueId: Joi.string().optional(),
    type: Joi.string().valid('vidange', 'pneus', 'revision', 'reparation', 'gasoil').required().messages({
        'any.required': 'Type requis',
        'any.only': 'Type invalide'
    }),
    description: Joi.string().required().messages({
        'any.required': 'Description requise'
    }),
    datePrevue: Joi.date().required().messages({
        'any.required': 'Date prévue requise'
    }),
    dateRealisee: Joi.date().optional(),
    cout: Joi.number().min(0).optional(),
    statut: Joi.string().valid('planifiee', 'terminee').default('planifiee')
}).or('camionId', 'remorqueId').messages({
    'object.missing': 'CamionId ou RemorqueId requis'
});

export const maintenanceUpdateSchema = maintenanceSchema.fork(
    ['type', 'description', 'datePrevue'],
    (schema) => schema.optional()
);

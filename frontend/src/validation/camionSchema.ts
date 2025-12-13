import Joi from 'joi';

export const camionSchema = Joi.object({
  immatriculation: Joi.string().trim().min(1).required().messages({
    'string.empty': 'L\'immatriculation est requise',
    'any.required': 'L\'immatriculation est requise'
  }),
  marque: Joi.string().trim().min(1).required().messages({
    'string.empty': 'La marque est requise',
    'any.required': 'La marque est requise'
  }),
  modele: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Le modèle est requis',
    'any.required': 'Le modèle est requis'
  }),
  annee: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).required().messages({
    'number.min': 'L\'année doit être supérieure à 1990',
    'number.max': `L\'année doit être inférieure à ${new Date().getFullYear() + 1}`,
    'any.required': 'L\'année est requise'
  }),
  kilometrage: Joi.number().min(0).required().messages({
    'number.min': 'Le kilométrage ne peut pas être négatif',
    'any.required': 'Le kilométrage est requis'
  }),
  statut: Joi.string().valid('disponible', 'en_mission', 'maintenance').required()
});
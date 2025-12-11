import Joi from 'joi';

// Schema pour l'inscription
export const registerSchema = Joi.object({
    nom: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Le nom doit contenir au moins 2 caractères',
            'any.required': 'Le nom est requis'
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email invalide',
            'any.required': 'Email requis'
        }),
    
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
            'any.required': 'Mot de passe requis'
        }),
    
    role: Joi.string()
        .valid('admin', 'chauffeur')
        .required()
        .messages({
            'any.only': 'Le rôle doit être admin ou chauffeur',
            'any.required': 'Rôle requis'
        }),
    
    telephone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            'string.pattern.base': 'Le téléphone doit contenir 10 chiffres',
            'any.required': 'Téléphone requis'
        })
});

// Schema pour le login
export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email invalide',
            'any.required': 'Email requis'
        }),
    
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Mot de passe requis'
        })
});

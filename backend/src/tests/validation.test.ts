import { registerSchema, loginSchema } from '../validators/userValidator';

describe('Validation Joi', () => {
    
    describe('Register Schema', () => {
        it('doit valider un register correct', () => {
            const data = {
                nom: 'John Doe',
                email: 'john@test.com',
                password: 'password123',
                role: 'chauffeur',
                telephone: '0612345678'
            };
            const { error } = registerSchema.validate(data);
            expect(error).toBeUndefined();
        });

        it('doit rejeter un email invalide', () => {
            const data = {
                nom: 'John',
                email: 'invalid-email',
                password: 'password123',
                role: 'chauffeur',
                telephone: '0612345678'
            };
            const { error } = registerSchema.validate(data);
            expect(error).toBeDefined();
        });

        it('doit rejeter un password trop court', () => {
            const data = {
                nom: 'John',
                email: 'john@test.com',
                password: '123',
                role: 'chauffeur',
                telephone: '0612345678'
            };
            const { error } = registerSchema.validate(data);
            expect(error).toBeDefined();
        });

        it('doit rejeter un rôle invalide', () => {
            const data = {
                nom: 'John',
                email: 'john@test.com',
                password: 'password123',
                role: 'manager',
                telephone: '0612345678'
            };
            const { error } = registerSchema.validate(data);
            expect(error).toBeDefined();
        });
    });

    describe('Login Schema', () => {
        it('doit valider un login correct', () => {
            const data = { email: 'john@test.com', password: 'password123' };
            const { error } = loginSchema.validate(data);
            expect(error).toBeUndefined();
        });

        it('doit rejeter sans email', () => {
            const data = { password: 'password123' };
            const { error } = loginSchema.validate(data);
            expect(error).toBeDefined();
        });
    });
});
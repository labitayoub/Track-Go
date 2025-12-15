// Mock des models
jest.mock('../models/userModel', () => ({
    userModel: { findOne: jest.fn(), find: jest.fn(), findByIdAndUpdate: jest.fn() }
}));
jest.mock('bcryptjs', () => ({ hash: jest.fn(), compare: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn() }));

import { userModel } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('UserService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('register: error si user existe', async () => {
        (userModel.findOne as jest.Mock).mockResolvedValue({ email: 'test@test.com' });
        const { register } = await import('../services/userService.js');
        const result = await register({ nom: 'Test', email: 'labit@test.com', password: '123', role: 'chauffeur', telephone: '06' });
        expect(result).toEqual({ error: { message: 'User already exists' } });
    });

    it('login: error si user non trouvé', async () => {
        (userModel.findOne as jest.Mock).mockResolvedValue(null);
        const { login } = await import('../services/userService.js');
        expect(await login({ email: 'x@x.com', password: '123' })).toEqual({ error: { message: 'User not found' } });
    });

    it('login: error si compte non activé', async () => {
        (userModel.findOne as jest.Mock).mockResolvedValue({ isActive: false });
        const { login } = await import('../services/userService.js');
        expect(await login({ email: 'x@x.com', password: '123' })).toEqual({ error: { message: 'Account not activated. Please wait for admin approval.' } });
    });

    it('login: succès retourne token', async () => {
        (userModel.findOne as jest.Mock).mockResolvedValue({ _id: '1', isActive: true, password: 'h', role: 'chauffeur' });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('token');
        const { login } = await import('../services/userService.js');
        const result = await login({ email: 'ayoub@test.com', password: '123' });
        expect(result).toHaveProperty('token', 'token');
    });

    it('activateUser: error si user non trouvé', async () => {
        (userModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
        const { activateUser } = await import('../services/userService.js');
        expect(await activateUser('bad-id')).toEqual({ error: { message: 'User not found' } });
    });
});

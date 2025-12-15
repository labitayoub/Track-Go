jest.mock('../models/pneuModel', () => ({
    pneuModel: { find: jest.fn(), findById: jest.fn(), findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn() }
}));
jest.mock('../models/camionModel', () => ({ camionModel: { findById: jest.fn() } }));
jest.mock('../models/remorqueModel', () => ({ remorqueModel: { findById: jest.fn() } }));
jest.mock('../models/trajetModel', () => ({ trajetModel: { find: jest.fn() } }));

import { pneuModel } from '../models/pneuModel.js';

describe('PneuService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('getAllPneus: retourne les pneus', async () => {
        const mock = [{ marque: 'Michelin' }];
        (pneuModel.find as jest.Mock).mockReturnValue({ sort: jest.fn().mockResolvedValue(mock) });
        const { getAllPneus } = await import('../services/pneuService.js');
        expect(await getAllPneus()).toEqual(mock);
    });

    it('getPneuById: retourne pneu', async () => {
        (pneuModel.findById as jest.Mock).mockResolvedValue({ _id: '1' });
        const { getPneuById } = await import('../services/pneuService.js');
        expect(await getPneuById('1')).toEqual({ _id: '1' });
    });

    it('updatePneu: met à jour', async () => {
        (pneuModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: '1' });
        const { updatePneu } = await import('../services/pneuService.js');
        expect(await updatePneu('1', {})).toEqual({ _id: '1' });
    });

    it('deletePneu: supprime', async () => {
        (pneuModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '1' });
        const { deletePneu } = await import('../services/pneuService.js');
        expect(await deletePneu('1')).toEqual({ _id: '1' });
    });
});

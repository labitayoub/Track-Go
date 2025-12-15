jest.mock('../models/camionModel', () => ({
    camionModel: { find: jest.fn(), findById: jest.fn(), findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn() }
}));
jest.mock('../services/trajetService', () => ({ getActiveTrajetResources: jest.fn() }));
jest.mock('../models/maintenanceModel', () => ({ maintenanceModel: { find: jest.fn() } }));

import { camionModel } from '../models/camionModel.js';

describe('CamionService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('getAllCamions: retourne les camions', async () => {
        const mock = [{ immatriculation: 'ABC' }];
        (camionModel.find as jest.Mock).mockReturnValue({ sort: jest.fn().mockResolvedValue(mock) });
        const { getAllCamions } = await import('../services/camionService.js');
        expect(await getAllCamions()).toEqual(mock);
    });

    it('getCamionById: retourne camion', async () => {
        (camionModel.findById as jest.Mock).mockResolvedValue({ _id: '1' });
        const { getCamionById } = await import('../services/camionService.js');
        expect(await getCamionById('1')).toEqual({ _id: '1' });
    });

    it('updateCamion: met à jour', async () => {
        (camionModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: '1', marque: 'X' });
        const { updateCamion } = await import('../services/camionService.js');
        expect(await updateCamion('1', { marque: 'X' })).toEqual({ _id: '1', marque: 'X' });
    });

    it('deleteCamion: supprime', async () => {
        (camionModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '1' });
        const { deleteCamion } = await import('../services/camionService.js');
        expect(await deleteCamion('1')).toEqual({ _id: '1' });
    });
});

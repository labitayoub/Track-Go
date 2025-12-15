jest.mock('../models/trajetModel', () => ({
    trajetModel: { find: jest.fn(), findById: jest.fn(), findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn() }
}));
jest.mock('../services/pneuService', () => ({ checkPneusKilometrage: jest.fn(), checkPneusForTrajet: jest.fn() }));

import { trajetModel } from '../models/trajetModel.js';

describe('TrajetService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('getActiveTrajetResources: retourne les ressources actives', async () => {
        (trajetModel.find as jest.Mock).mockResolvedValue([{ camionId: 'c1', remorqueId: 'r1', chauffeurId: 'ch1' }]);
        const { getActiveTrajetResources } = await import('../services/trajetService.js');
        const result = await getActiveTrajetResources();
        expect(result.camionIds).toContain('c1');
    });

    it('getAllTrajets: retourne les trajets', async () => {
        const mock = [{ destination: 'Paris' }];
        (trajetModel.find as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(mock) }) }) })
        });
        const { getAllTrajets } = await import('../services/trajetService.js');
        expect(await getAllTrajets()).toEqual(mock);
    });

    it('updateTrajet: met à jour', async () => {
        (trajetModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: '1' });
        const { updateTrajet } = await import('../services/trajetService.js');
        expect(await updateTrajet('1', {})).toEqual({ _id: '1' });
    });

    it('deleteTrajet: supprime', async () => {
        (trajetModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '1' });
        const { deleteTrajet } = await import('../services/trajetService.js');
        expect(await deleteTrajet('1')).toEqual({ _id: '1' });
    });
});

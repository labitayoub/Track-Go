jest.mock('../models/remorqueModel', () => ({
    remorqueModel: { find: jest.fn(), findById: jest.fn(), findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn() }
}));
jest.mock('../services/trajetService', () => ({ getActiveTrajetResources: jest.fn() }));

import { remorqueModel } from '../models/remorqueModel.js';

describe('RemorqueService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('getAllRemorques: retourne les remorques', async () => {
        const mock = [{ immatriculation: 'REM' }];
        (remorqueModel.find as jest.Mock).mockReturnValue({ sort: jest.fn().mockResolvedValue(mock) });
        const { getAllRemorques } = await import('../services/remorqueService.js');
        expect(await getAllRemorques()).toEqual(mock);
    });

    it('getRemorqueById: retourne remorque', async () => {
        (remorqueModel.findById as jest.Mock).mockResolvedValue({ _id: '1' });
        const { getRemorqueById } = await import('../services/remorqueService.js');
        expect(await getRemorqueById('1')).toEqual({ _id: '1' });
    });

    it('updateRemorque: met à jour', async () => {
        (remorqueModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: '1' });
        const { updateRemorque } = await import('../services/remorqueService.js');
        expect(await updateRemorque('1', {})).toEqual({ _id: '1' });
    });

    it('deleteRemorque: supprime', async () => {
        (remorqueModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '1' });
        const { deleteRemorque } = await import('../services/remorqueService.js');
        expect(await deleteRemorque('1')).toEqual({ _id: '1' });
    });
});

jest.mock('../models/maintenanceModel', () => ({
    maintenanceModel: { find: jest.fn(), findById: jest.fn(), findByIdAndUpdate: jest.fn(), findByIdAndDelete: jest.fn() }
}));

import { maintenanceModel } from '../models/maintenanceModel.js';

describe('MaintenanceService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('getAllMaintenances: retourne les maintenances', async () => {
        const mock = [{ type: 'vidange' }];
        (maintenanceModel.find as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(mock) }) })
        });
        const { getAllMaintenances } = await import('../services/maintenanceService.js');
        expect(await getAllMaintenances()).toEqual(mock);
    });

    it('getMaintenanceById: retourne maintenance', async () => {
        (maintenanceModel.findById as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue({ _id: '1' }) })
        });
        const { getMaintenanceById } = await import('../services/maintenanceService.js');
        expect(await getMaintenanceById('1')).toEqual({ _id: '1' });
    });

    it('updateMaintenance: met à jour', async () => {
        (maintenanceModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: '1' });
        const { updateMaintenance } = await import('../services/maintenanceService.js');
        expect(await updateMaintenance('1', {})).toEqual({ _id: '1' });
    });

    it('deleteMaintenance: supprime', async () => {
        (maintenanceModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '1' });
        const { deleteMaintenance } = await import('../services/maintenanceService.js');
        expect(await deleteMaintenance('1')).toEqual({ _id: '1' });
    });
});

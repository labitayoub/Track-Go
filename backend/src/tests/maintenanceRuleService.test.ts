jest.mock('../models/maintenanceRuleModel.js', () => ({
    maintenanceRuleModel: {
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findOneAndUpdate: jest.fn()
    }
}));
jest.mock('../models/maintenanceModel.js', () => ({
    maintenanceModel: { findOne: jest.fn(), create: jest.fn() }
}));
jest.mock('../models/camionModel.js', () => ({
    camionModel: { find: jest.fn() }
}));

import { maintenanceRuleModel } from '../models/maintenanceRuleModel.js';
import { maintenanceModel } from '../models/maintenanceModel.js';
import { camionModel } from '../models/camionModel.js';

describe('MaintenanceRuleService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('getAllRules: retourne les règles', async () => {
        const mock = [{ nom: 'Vidange', type: 'vidange' }];
        (maintenanceRuleModel.find as jest.Mock).mockReturnValue({ sort: jest.fn().mockResolvedValue(mock) });
        const { getAllRules } = await import('../services/maintenanceRuleService.js');
        expect(await getAllRules()).toEqual(mock);
    });

    it('getRuleById: retourne une règle', async () => {
        (maintenanceRuleModel.findById as jest.Mock).mockResolvedValue({ _id: '1', nom: 'Vidange' });
        const { getRuleById } = await import('../services/maintenanceRuleService.js');
        expect(await getRuleById('1')).toEqual({ _id: '1', nom: 'Vidange' });
    });

    it('updateRule: met à jour', async () => {
        (maintenanceRuleModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: '1', seuilKm: 15000 });
        const { updateRule } = await import('../services/maintenanceRuleService.js');
        expect(await updateRule('1', { seuilKm: 15000 })).toEqual({ _id: '1', seuilKm: 15000 });
    });

    it('deleteRule: supprime', async () => {
        (maintenanceRuleModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '1' });
        const { deleteRule } = await import('../services/maintenanceRuleService.js');
        expect(await deleteRule('1')).toEqual({ _id: '1' });
    });

    it('calculerAlertes: retourne alertes pour camions', async () => {
        (maintenanceRuleModel.find as jest.Mock).mockResolvedValue([
            { type: 'vidange', seuilKm: 10000, seuilJours: 180, alerteAvantKm: 1000, alerteAvantJours: 14, actif: true }
        ]);
        (camionModel.find as jest.Mock).mockResolvedValue([
            { _id: 'c1', immatriculation: 'ABC-123', kilometrage: 9500 }
        ]);
        (maintenanceModel.findOne as jest.Mock).mockReturnValue({ sort: jest.fn().mockResolvedValue(null) });

        const { calculerAlertes } = await import('../services/maintenanceRuleService.js');
        const alertes = await calculerAlertes();
        
        expect(alertes.length).toBe(1);
        expect(alertes[0].type).toBe('vidange');
        expect(alertes[0].urgence).toBe('critique');
    });
});

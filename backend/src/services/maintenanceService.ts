import { maintenanceModel, type IMaintenance } from '../models/maintenanceModel.js';

export const createMaintenance = async (data: Partial<IMaintenance>) => {
    const maintenance = new maintenanceModel(data);
    return maintenance.save();
};

export const getAllMaintenances = async () => {
    return maintenanceModel.find()
        .populate('camionId', 'immatriculation')
        .sort({ datePrevue: -1 });
};

export const getMaintenancesByCamion = async (camionId: string) => {
    return maintenanceModel.find({ camionId }).sort({ datePrevue: -1 });
};

export const getMaintenanceById = async (id: string) => {
    return maintenanceModel.findById(id).populate('camionId', 'immatriculation');
};

export const updateMaintenance = async (id: string, data: Partial<IMaintenance>) => {
    return maintenanceModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMaintenance = async (id: string) => {
    return maintenanceModel.findByIdAndDelete(id);
};

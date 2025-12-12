import { camionModel, type ICamion } from '../models/camionModel.js';
import { getActiveTrajetResources } from './trajetService.js';

export const getAvailableCamions = async () => {
    const { camionIds } = await getActiveTrajetResources();
    return camionModel.find({ 
        _id: { $nin: camionIds },
        statut: { $ne: 'maintenance' }
    }).sort({ createdAt: -1 });
};

export const createCamion = async (data: Partial<ICamion>) => {
    const camion = new camionModel(data);
    return camion.save();
};

export const getAllCamions = async () => {
    return camionModel.find().sort({ createdAt: -1 });
};

export const getCamionById = async (id: string) => {
    return camionModel.findById(id);
};

export const updateCamion = async (id: string, data: Partial<ICamion>) => {
    return camionModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCamion = async (id: string) => {
    return camionModel.findByIdAndDelete(id);
};

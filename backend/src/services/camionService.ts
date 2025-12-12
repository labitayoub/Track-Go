import { camionModel, type ICamion } from '../models/camionModel.js';

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

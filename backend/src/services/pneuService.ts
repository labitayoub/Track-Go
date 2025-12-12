import { pneuModel, type IPneu } from '../models/pneuModel.js';

export const createPneu = async (data: Partial<IPneu>) => {
    const pneu = new pneuModel(data);
    return pneu.save();
};

export const getAllPneus = async () => {
    return pneuModel.find().sort({ createdAt: -1 });
};

export const getPneusByVehicule = async (vehiculeId: string, vehiculeType: string) => {
    return pneuModel.find({ vehiculeId, vehiculeType });
};

export const getPneuById = async (id: string) => {
    return pneuModel.findById(id);
};

export const updatePneu = async (id: string, data: Partial<IPneu>) => {
    return pneuModel.findByIdAndUpdate(id, data, { new: true });
};

export const deletePneu = async (id: string) => {
    return pneuModel.findByIdAndDelete(id);
};
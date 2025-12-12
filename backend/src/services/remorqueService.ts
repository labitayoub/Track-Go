import { remorqueModel, type IRemorque } from '../models/remorqueModel.js';
import { getActiveTrajetResources } from './trajetService.js';

export const getAvailableRemorques = async () => {
    const { remorqueIds } = await getActiveTrajetResources();
    return remorqueModel.find({ 
        _id: { $nin: remorqueIds },
        statut: { $ne: 'maintenance' }
    }).sort({ createdAt: -1 });
};

export const createRemorque = async (data: Partial<IRemorque>) => {
    const remorque = new remorqueModel(data);
    return remorque.save();
};

export const getAllRemorques = async () => {
    return remorqueModel.find().sort({ createdAt: -1 });
};

export const getRemorqueById = async (id: string) => {
    return remorqueModel.findById(id);
};

export const updateRemorque = async (id: string, data: Partial<IRemorque>) => {
    return remorqueModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteRemorque = async (id: string) => {
    return remorqueModel.findByIdAndDelete(id);
};

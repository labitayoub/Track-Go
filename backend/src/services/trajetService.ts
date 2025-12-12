import { trajetModel, type ITrajet } from '../models/trajetModel.js';

export const createTrajet = async (data: Partial<ITrajet>) => {
    const trajet = new trajetModel(data);
    return trajet.save();
};

export const getAllTrajets = async () => {
    return trajetModel.find()
        .populate('chauffeurId', 'nom prenom')
        .populate('camionId', 'immatriculation')
        .populate('remorqueId', 'immatriculation')
        .sort({ dateDepart: -1 });
};

export const getTrajetsByChauffeur = async (chauffeurId: string) => {
    return trajetModel.find({ chauffeurId })
        .populate('camionId', 'immatriculation')
        .populate('remorqueId', 'immatriculation')
        .sort({ dateDepart: -1 });
};

export const getTrajetById = async (id: string) => {
    return trajetModel.findById(id)
        .populate('chauffeurId', 'nom prenom')
        .populate('camionId', 'immatriculation')
        .populate('remorqueId', 'immatriculation');
};

export const updateTrajet = async (id: string, data: Partial<ITrajet>) => {
    return trajetModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteTrajet = async (id: string) => {
    return trajetModel.findByIdAndDelete(id);
};

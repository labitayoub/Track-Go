import { trajetModel, type ITrajet } from '../models/trajetModel.js';

// Récupérer les IDs des ressources actuellement en trajet actif
export const getActiveTrajetResources = async () => {
    const activeTrajets = await trajetModel.find({ 
        statut: { $in: ['a_faire', 'en_cours'] } 
    });
    
    return {
        camionIds: activeTrajets.map(t => t.camionId.toString()),
        remorqueIds: activeTrajets.filter(t => t.remorqueId).map(t => t.remorqueId!.toString()),
        chauffeurIds: activeTrajets.map(t => t.chauffeurId.toString())
    };
};

export const createTrajet = async (data: Partial<ITrajet>) => {
    const trajet = new trajetModel(data);
    return trajet.save();
};

export const getAllTrajets = async () => {
    return trajetModel.find()
        .populate('chauffeurId', 'nom')
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
        .populate('chauffeurId', 'nom')
        .populate('camionId', 'immatriculation')
        .populate('remorqueId', 'immatriculation');
};

export const updateTrajet = async (id: string, data: Partial<ITrajet>) => {
    return trajetModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteTrajet = async (id: string) => {
    return trajetModel.findByIdAndDelete(id);
};

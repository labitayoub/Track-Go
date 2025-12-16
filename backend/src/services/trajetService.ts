import { trajetModel, type ITrajet } from '../models/trajetModel.js';
import { checkPneusKilometrage, checkPneusForTrajet } from './pneuService.js';
import { calculerAlertes } from './maintenanceRuleService.js';
import { camionModel } from '../models/camionModel.js';

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
    // Vérification proactive des pneus AVANT de créer le trajet
    if (data.camionId && data.kilometrage) {
        await checkPneusForTrajet(
            data.camionId.toString(),
            data.remorqueId?.toString(),
            data.kilometrage
        );
    }

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
    const trajet = await trajetModel.findById(id);
    const updatedTrajet = await trajetModel.findByIdAndUpdate(id, data, { new: true });

    // Si le trajet est terminé, mettre à jour le km du camion et vérifier les maintenances
    if (data.statut === 'termine' && trajet) {
        console.log('Trajet terminé, mise à jour kilométrage et vérification maintenances...');
        
        // Mettre à jour le kilométrage du camion
        if (trajet.camionId && trajet.kilometrage) {
            await camionModel.findByIdAndUpdate(trajet.camionId, {
                $inc: { kilometrage: trajet.kilometrage }
            });
            console.log(`Camion ${trajet.camionId}: +${trajet.kilometrage}km`);
        }
        
        // Vérifier les pneus
        await checkPneusKilometrage();
    }

    return updatedTrajet;
};

export const deleteTrajet = async (id: string) => {
    return trajetModel.findByIdAndDelete(id);
};

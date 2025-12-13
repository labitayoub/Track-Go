import { pneuModel, type IPneu } from '../models/pneuModel.js';
import { camionModel } from '../models/camionModel.js';
import { remorqueModel } from '../models/remorqueModel.js';

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

// Get critical tires (critique) grouped by vehicle with vehicle info
export const getCritiquesPneus = async () => {
    console.log('=== getCritiquesPneus appelé ===' );
    
    // Chercher tous les pneus pour debug
    const allPneus = await pneuModel.find();
    console.log('Tous les pneus:', allPneus.map(p => ({ id: p._id, statut: p.statut, position: p.position })));
    
    const pneusCritiques = await pneuModel.find({ statut: 'critique' });
    console.log('Pneus critiques trouvés:', pneusCritiques.length);
    
    // Group by vehicle
    const vehiculesMap = new Map<string, {
        vehiculeId: string;
        vehiculeType: string;
        immatriculation: string;
        pneus: Array<{ position: string; marque: string; _id: string }>;
    }>();
    
    for (const pneu of pneusCritiques) {
        const key = `${pneu.vehiculeType}-${pneu.vehiculeId}`;
        
        if (!vehiculesMap.has(key)) {
            // Get vehicle immatriculation
            let immatriculation = 'Inconnu';
            if (pneu.vehiculeType === 'camion') {
                const camion = await camionModel.findById(pneu.vehiculeId);
                immatriculation = camion?.immatriculation || 'Inconnu';
            } else {
                const remorque = await remorqueModel.findById(pneu.vehiculeId);
                immatriculation = remorque?.immatriculation || 'Inconnu';
            }
            
            vehiculesMap.set(key, {
                vehiculeId: pneu.vehiculeId.toString(),
                vehiculeType: pneu.vehiculeType,
                immatriculation,
                pneus: []
            });
        }
        
        vehiculesMap.get(key)!.pneus.push({
            _id: pneu._id.toString(),
            position: pneu.position,
            marque: pneu.marque
        });
    }
    
    return Array.from(vehiculesMap.values());
};
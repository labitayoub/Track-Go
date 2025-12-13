import { pneuModel, type IPneu } from '../models/pneuModel.js';
import { camionModel } from '../models/camionModel.js';
import { remorqueModel } from '../models/remorqueModel.js';
import { trajetModel } from '../models/trajetModel.js';

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
    console.log('=== getCritiquesPneus appelé ===');

    // Vérifier d'abord les limites kilométriques
    await checkPneusKilometrage();

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

// Check and update tire status based on mileage from completed trips
export const checkPneusKilometrage = async () => {
    try {
        console.log('=== Vérification kilométrage pneus ===');

        const pneus = await pneuModel.find();
        console.log(`Trouvé ${pneus.length} pneus à vérifier`);

        let updatedCount = 0;

        for (const pneu of pneus) {
            console.log(`Vérification pneu ${pneu.position} - véhicule ${pneu.vehiculeId} (${pneu.vehiculeType})`);

            // Get completed trips for this vehicle
            const query = pneu.vehiculeType === 'camion'
                ? { camionId: pneu.vehiculeId, statut: 'termine' }
                : { remorqueId: pneu.vehiculeId, statut: 'termine' };

            const trajetsTermines = await trajetModel.find(query);
            console.log(`Trouvé ${trajetsTermines.length} trajets terminés`);

            const totalKmTrajets = trajetsTermines.reduce((sum, trajet) => sum + trajet.kilometrage, 0);
            const kmActuel = pneu.kmInstallation + totalKmTrajets;

            console.log(`Pneu ${pneu.position}: ${kmActuel}km actuel vs ${pneu.kmLimite}km limite`);

            // Check if tire has exceeded its limit and is not already critical
            if (kmActuel >= pneu.kmLimite && pneu.statut !== 'critique') {
                await pneuModel.findByIdAndUpdate(pneu._id, { statut: 'critique' });
                updatedCount++;
                console.log(`✓ Pneu ${pneu.position} marqué comme critique`);
            }
        }

        console.log(`${updatedCount} pneus mis à jour vers statut critique`);
        return updatedCount;
    } catch (error) {
        console.error('Erreur lors de la vérification des pneus:', error);
        throw error;
    }
};

// Check tires BEFORE creating a trip (proactive check)
// Updates tire status to 'critique' if trip kilometrage >= tire kmLimite
export const checkPneusForTrajet = async (
    camionId: string,
    remorqueId: string | undefined,
    kmTrajet: number
) => {
    try {
        console.log('=== Vérification proactive des pneus avant trajet ===');
        console.log(`Camion: ${camionId}, Remorque: ${remorqueId || 'Aucune'}, Km trajet: ${kmTrajet}`);

        let updatedCount = 0;

        // Check tires for the truck (camion)
        const pneusCamion = await pneuModel.find({ vehiculeId: camionId, vehiculeType: 'camion' });
        console.log(`Trouvé ${pneusCamion.length} pneus pour le camion`);

        for (const pneu of pneusCamion) {
            console.log(`Pneu ${pneu.position}: kmTrajet ${kmTrajet} vs kmLimite ${pneu.kmLimite}`);

            // Simple comparison: if trip km >= tire km limit -> critical
            if (kmTrajet >= pneu.kmLimite && pneu.statut !== 'critique') {
                await pneuModel.findByIdAndUpdate(pneu._id, { statut: 'critique' });
                updatedCount++;
                console.log(`✓ Pneu ${pneu.position} du camion marqué comme critique`);
            }
        }

        // Check tires for the trailer (remorque) if present
        if (remorqueId) {
            const pneusRemorque = await pneuModel.find({ vehiculeId: remorqueId, vehiculeType: 'remorque' });
            console.log(`Trouvé ${pneusRemorque.length} pneus pour la remorque`);

            for (const pneu of pneusRemorque) {
                console.log(`Pneu ${pneu.position}: kmTrajet ${kmTrajet} vs kmLimite ${pneu.kmLimite}`);

                // Simple comparison: if trip km >= tire km limit -> critical
                if (kmTrajet >= pneu.kmLimite && pneu.statut !== 'critique') {
                    await pneuModel.findByIdAndUpdate(pneu._id, { statut: 'critique' });
                    updatedCount++;
                    console.log(`✓ Pneu ${pneu.position} de la remorque marqué comme critique`);
                }
            }
        }

        console.log(`${updatedCount} pneus mis à jour vers statut critique`);
        return updatedCount;
    } catch (error) {
        console.error('Erreur lors de la vérification proactive des pneus:', error);
        throw error;
    }
};
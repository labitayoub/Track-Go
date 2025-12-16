import { maintenanceRuleModel, type IMaintenanceRule } from '../models/maintenanceRuleModel.js';
import { maintenanceModel } from '../models/maintenanceModel.js';
import { camionModel } from '../models/camionModel.js';

// CRUD
export const createRule = async (data: Partial<IMaintenanceRule>) => new maintenanceRuleModel(data).save();
export const getAllRules = async () => maintenanceRuleModel.find().sort({ type: 1 });
export const getRuleById = async (id: string) => maintenanceRuleModel.findById(id);
export const updateRule = async (id: string, data: Partial<IMaintenanceRule>) => maintenanceRuleModel.findByIdAndUpdate(id, data, { new: true });
export const deleteRule = async (id: string) => maintenanceRuleModel.findByIdAndDelete(id);

// Calcul automatique des alertes pour un camion spécifique
export const calculerAlertes = async (camionId: string) => {
    const regles = await maintenanceRuleModel.find({ actif: true });
    const camion = await camionModel.findById(camionId);
    if (!camion) return [];
    
    const alertes: any[] = [];

    for (const regle of regles) {
        const derniere = await maintenanceModel.findOne({
            camionId: camion._id,
            type: regle.type,
            statut: 'terminee'
        }).sort({ dateRealisee: -1 });

        // Calcul km depuis dernière maintenance (ou depuis 0 si jamais fait)
        const kmDerniereMaintenance = derniere?.cout || 0;
        const kmDepuis = camion.kilometrage - kmDerniereMaintenance;
        const kmRestant = regle.seuilKm - kmDepuis;

        let urgence: 'critique' | 'urgent' | 'preventive' = 'preventive';
        if (kmRestant <= 0) urgence = 'critique';
        else if (kmRestant <= regle.alerteAvantKm) urgence = 'urgent';

        if (kmRestant <= regle.alerteAvantKm) {
            alertes.push({
                type: regle.type,
                urgence,
                kmRestant: Math.max(0, kmRestant),
                seuilKm: regle.seuilKm,
                kmActuel: camion.kilometrage,
                message: `${Math.max(0, kmRestant)} km restants avant ${regle.type}`
            });
        }
    }
    return alertes;
};

// Calcul de toutes les alertes pour tous les camions
export const calculerToutesAlertes = async () => {
    const camions = await camionModel.find();
    const toutesAlertes: any[] = [];

    for (const camion of camions) {
        const alertes = await calculerAlertes(camion._id.toString());
        if (alertes.length > 0) {
            toutesAlertes.push({
                camionId: camion._id,
                immatriculation: camion.immatriculation,
                marque: camion.marque,
                modele: camion.modele,
                kilometrage: camion.kilometrage,
                alertes
            });
        }
    }
    return toutesAlertes;
};

// Générer maintenances planifiées pour un camion
export const genererMaintenances = async (camionId: string) => {
    const alertes = await calculerAlertes(camionId);
    const created: any[] = [];

    for (const a of alertes) {
        const existe = await maintenanceModel.findOne({ camionId, type: a.type, statut: 'planifiee' });
        if (existe) continue;

        const datePrevue = new Date();
        datePrevue.setDate(datePrevue.getDate() + (a.urgence === 'critique' ? 1 : 7));

        const m = await maintenanceModel.create({
            camionId,
            type: a.type,
            description: `[AUTO] ${a.type} - ${a.kmRestant}km restants`,
            datePrevue,
            statut: 'planifiee'
        });
        created.push(m);
    }
    return created;
};

// Seeder des règles par défaut
export const seedDefaultRules = async () => {
    const defaults = [
        { nom: 'Vidange moteur', type: 'vidange', seuilKm: 10000, alerteAvantKm: 1000 },
        { nom: 'Changement pneus', type: 'pneus', seuilKm: 50000, alerteAvantKm: 5000 },
        { nom: 'Révision générale', type: 'revision', seuilKm: 30000, alerteAvantKm: 3000 },
        { nom: 'Contrôle gasoil', type: 'gasoil', seuilKm: 5000, alerteAvantKm: 500 }
    ];

    for (const r of defaults) {
        await maintenanceRuleModel.findOneAndUpdate({ type: r.type }, r, { upsert: true });
    }
    console.log('✓ Règles de maintenance par défaut créées');
};

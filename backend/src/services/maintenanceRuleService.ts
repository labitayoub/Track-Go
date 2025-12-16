import { maintenanceRuleModel, type IMaintenanceRule } from '../models/maintenanceRuleModel.js';
import { maintenanceModel } from '../models/maintenanceModel.js';
import { camionModel } from '../models/camionModel.js';

// CRUD
export const createRule = async (data: Partial<IMaintenanceRule>) => new maintenanceRuleModel(data).save();
export const getAllRules = async () => maintenanceRuleModel.find().sort({ type: 1 });
export const getRuleById = async (id: string) => maintenanceRuleModel.findById(id);
export const updateRule = async (id: string, data: Partial<IMaintenanceRule>) => maintenanceRuleModel.findByIdAndUpdate(id, data, { new: true });
export const deleteRule = async (id: string) => maintenanceRuleModel.findByIdAndDelete(id);

// Calcul automatique des alertes
export const calculerAlertes = async () => {
    const regles = await maintenanceRuleModel.find({ actif: true });
    const camions = await camionModel.find();
    const alertes: any[] = [];

    for (const camion of camions) {
        for (const regle of regles) {
            const derniere = await maintenanceModel.findOne({
                camionId: camion._id,
                type: regle.type,
                statut: 'terminee'
            }).sort({ dateRealisee: -1 });

            const kmDepuis = derniere ? camion.kilometrage - (derniere.cout || 0) : camion.kilometrage;
            const joursDepuis = derniere?.dateRealisee
                ? Math.floor((Date.now() - new Date(derniere.dateRealisee).getTime()) / 86400000)
                : 999;

            const kmRestant = regle.seuilKm - kmDepuis;
            const joursRestant = regle.seuilJours - joursDepuis;

            if (kmRestant <= regle.alerteAvantKm || joursRestant <= regle.alerteAvantJours) {
                alertes.push({
                    camionId: camion._id,
                    immatriculation: camion.immatriculation,
                    type: regle.type,
                    urgence: kmRestant <= 0 || joursRestant <= 0 ? 'critique' : 'preventive',
                    kmRestant: Math.max(0, kmRestant),
                    joursRestant: Math.max(0, joursRestant)
                });
            }
        }
    }
    return alertes;
};

// Générer maintenances planifiées automatiquement
export const genererMaintenances = async () => {
    const alertes = await calculerAlertes();
    const created: any[] = [];

    for (const a of alertes) {
        const existe = await maintenanceModel.findOne({ camionId: a.camionId, type: a.type, statut: 'planifiee' });
        if (existe) continue;

        const datePrevue = new Date();
        datePrevue.setDate(datePrevue.getDate() + (a.urgence === 'critique' ? 1 : 7));

        const m = await maintenanceModel.create({
            camionId: a.camionId,
            type: a.type,
            description: `[AUTO] ${a.type} - ${a.kmRestant}km / ${a.joursRestant}j restants`,
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
        { nom: 'Vidange moteur', type: 'vidange', seuilKm: 10000, seuilJours: 180, alerteAvantKm: 1000, alerteAvantJours: 14 },
        { nom: 'Changement pneus', type: 'pneus', seuilKm: 50000, seuilJours: 730, alerteAvantKm: 5000, alerteAvantJours: 30 },
        { nom: 'Révision générale', type: 'revision', seuilKm: 30000, seuilJours: 365, alerteAvantKm: 3000, alerteAvantJours: 30 },
        { nom: 'Contrôle gasoil', type: 'gasoil', seuilKm: 5000, seuilJours: 30, alerteAvantKm: 500, alerteAvantJours: 7 }
    ];

    for (const r of defaults) {
        await maintenanceRuleModel.findOneAndUpdate({ type: r.type }, r, { upsert: true });
    }
    console.log('✓ Règles de maintenance par défaut créées');
};

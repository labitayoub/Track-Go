import { maintenanceModel, type IMaintenance } from '../models/maintenanceModel.js';

export const createMaintenance = async (data: Partial<IMaintenance>) => {
    const maintenance = new maintenanceModel(data);
    return maintenance.save();
};

export const getAllMaintenances = async () => {
    return maintenanceModel.find()
        .populate('camionId', 'immatriculation')
        .sort({ datePrevue: -1 });
};

export const getMaintenancesByCamion = async (camionId: string) => {
    return maintenanceModel.find({ camionId }).sort({ datePrevue: -1 });
};

export const getMaintenanceById = async (id: string) => {
    return maintenanceModel.findById(id).populate('camionId', 'immatriculation');
};

export const updateMaintenance = async (id: string, data: Partial<IMaintenance>) => {
    return maintenanceModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMaintenance = async (id: string) => {
    return maintenanceModel.findByIdAndDelete(id);
};

// Get upcoming maintenances (next 7 days, not completed)
export const getUpcomingMaintenances = async () => {
    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);

    return maintenanceModel.find({
        datePrevue: { $gte: now, $lte: in7Days },
        statut: 'planifiee'
    })
        .populate('camionId', 'immatriculation marque modele')
        .sort({ datePrevue: 1 });
};

// Get overdue maintenances (past due date, not completed)
export const getOverdueMaintenances = async () => {
    const now = new Date();

    return maintenanceModel.find({
        datePrevue: { $lt: now },
        statut: 'planifiee'
    })
        .populate('camionId', 'immatriculation marque modele')
        .sort({ datePrevue: 1 });
};

// Get maintenance statistics for dashboard
export const getMaintenanceStats = async () => {
    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);

    const [total, planifiees, terminees, enRetard, aVenir] = await Promise.all([
        maintenanceModel.countDocuments(),
        maintenanceModel.countDocuments({ statut: 'planifiee' }),
        maintenanceModel.countDocuments({ statut: 'terminee' }),
        maintenanceModel.countDocuments({ datePrevue: { $lt: now }, statut: 'planifiee' }),
        maintenanceModel.countDocuments({ datePrevue: { $gte: now, $lte: in7Days }, statut: 'planifiee' })
    ]);

    return {
        total,
        planifiees,
        terminees,
        enRetard,
        aVenir
    };
};

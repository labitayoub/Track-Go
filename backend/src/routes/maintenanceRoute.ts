import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import {
    createMaintenanceController,
    getAllMaintenancesController,
    getMaintenancesByCamionController,
    getMaintenanceByIdController,
    updateMaintenanceController,
    deleteMaintenanceController,
    getUpcomingMaintenancesController,
    getOverdueMaintenancesController,
    getMaintenanceStatsController
} from '../controllers/maintenanceController.js';

const router = Router();

router.use(authenticate);

// Routes accessibles à tous les utilisateurs authentifiés
router.get('/upcoming', getUpcomingMaintenancesController);
router.get('/overdue', getOverdueMaintenancesController);
router.get('/stats', getMaintenanceStatsController);

// Routes admin only
router.use(authorize('admin'));
router.post('/', createMaintenanceController);
router.get('/', getAllMaintenancesController);
router.get('/camion/:camionId', getMaintenancesByCamionController);
router.get('/:id', getMaintenanceByIdController);
router.put('/:id', updateMaintenanceController);
router.delete('/:id', deleteMaintenanceController);

export default router;

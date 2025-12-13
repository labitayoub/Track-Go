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

// Routes accessibles aux admins et chauffeurs
router.post('/', authorize('admin', 'chauffeur'), createMaintenanceController);
router.get('/', authorize('admin', 'chauffeur'), getAllMaintenancesController);
router.get('/camion/:camionId', authorize('admin', 'chauffeur'), getMaintenancesByCamionController);
router.get('/:id', authorize('admin', 'chauffeur'), getMaintenanceByIdController);
router.put('/:id', authorize('admin', 'chauffeur'), updateMaintenanceController);

// Routes admin only
router.delete('/:id', authorize('admin'), deleteMaintenanceController);

export default router;

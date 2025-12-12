import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import {
    createMaintenanceController,
    getAllMaintenancesController,
    getMaintenancesByCamionController,
    getMaintenanceByIdController,
    updateMaintenanceController,
    deleteMaintenanceController
} from '../controllers/maintenanceController.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin')); // Toutes les routes maintenance sont admin only

router.post('/', createMaintenanceController);
router.get('/', getAllMaintenancesController);
router.get('/camion/:camionId', getMaintenancesByCamionController);
router.get('/:id', getMaintenanceByIdController);
router.put('/:id', updateMaintenanceController);
router.delete('/:id', deleteMaintenanceController);

export default router;

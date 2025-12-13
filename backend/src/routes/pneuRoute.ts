import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import {
    createPneuController,
    getAllPneusController,
    getPneusByVehiculeController,
    getPneuByIdController,
    updatePneuController,
    deletePneuController,
    getCritiquesController
} from '../controllers/pneuController.js';

const router = Router();

router.use(authenticate);

router.get('/critiques', getCritiquesController);
router.post('/', authorize('admin'), createPneuController);
router.get('/', getAllPneusController);
router.get('/vehicule/:vehiculeType/:vehiculeId', getPneusByVehiculeController);
router.get('/:id', getPneuByIdController);
router.put('/:id', authorize('admin'), updatePneuController);
router.delete('/:id', authorize('admin'), deletePneuController);

export default router;
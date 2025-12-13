import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import {
    createPneuController,
    getAllPneusController,
    getPneusByVehiculeController,
    getPneuByIdController,
    updatePneuController,
    deletePneuController,
    getCritiquesController,
    checkKilometrageController
} from '../controllers/pneuController.js';

const router = Router();

router.use(authenticate);

router.get('/critiques', getCritiquesController);
router.post('/check-kilometrage', authorize('admin', 'chauffeur'), checkKilometrageController);
router.post('/', authorize('admin', 'chauffeur'), createPneuController);
router.get('/', getAllPneusController);
router.get('/vehicule/:vehiculeType/:vehiculeId', getPneusByVehiculeController);
router.get('/:id', getPneuByIdController);
router.put('/:id', authorize('admin', 'chauffeur'), updatePneuController);
router.delete('/:id', authorize('admin'), deletePneuController);

export default router;
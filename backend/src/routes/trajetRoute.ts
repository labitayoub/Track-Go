import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import {
    createTrajetController,
    getAllTrajetsController,
    getMyTrajetsController,
    getTrajetByIdController,
    updateTrajetController,
    deleteTrajetController
} from '../controllers/trajetController.js';

const router = Router();

router.use(authenticate);

// Routes Admin
router.post('/', authorize('admin'), createTrajetController);
router.get('/', authorize('admin'), getAllTrajetsController);
router.delete('/:id', authorize('admin'), deleteTrajetController);

// Routes Chauffeur - ses propres trajets
router.get('/mes-trajets', getMyTrajetsController);
router.get('/:id', getTrajetByIdController);
router.put('/:id', updateTrajetController); // Chauffeur peut mettre à jour son trajet

export default router;

import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import {
    createCamionController,
    getAllCamionsController,
    getCamionByIdController,
    updateCamionController,
    deleteCamionController
} from '../controllers/camionController.js';

const router = Router();

// Toutes les routes nécessitent authentification
router.use(authenticate);

// Routes CRUD - Admin seulement
router.post('/', authorize('admin'), createCamionController);
router.get('/', getAllCamionsController);
router.get('/:id', getCamionByIdController);
router.put('/:id', authorize('admin'), updateCamionController);
router.delete('/:id', authorize('admin'), deleteCamionController);

export default router;

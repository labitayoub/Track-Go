import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import {
    createRemorqueController,
    getAllRemorquesController,
    getRemorqueByIdController,
    updateRemorqueController,
    deleteRemorqueController
} from '../controllers/remorqueController.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize('admin'), createRemorqueController);
router.get('/', getAllRemorquesController);
router.get('/:id', getRemorqueByIdController);
router.put('/:id', authorize('admin'), updateRemorqueController);
router.delete('/:id', authorize('admin'), deleteRemorqueController);

export default router;

import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import * as ctrl from '../controllers/maintenanceRuleController.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/toutes-alertes', ctrl.getToutesAlertes);
router.get('/alertes/:camionId', ctrl.getAlertes);
router.post('/generer/:camionId', ctrl.generer);
router.post('/seed', ctrl.seed);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;

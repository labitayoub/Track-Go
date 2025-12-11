import express from "express";
import { registerController, loginController, getChauffeursController, toggleStatusController } from "../controllers/userController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.post('/register', registerController);
router.post('/login', loginController);

// Routes admin
router.get('/chauffeurs', authenticate, authorize('admin'), getChauffeursController);
router.patch('/chauffeurs/:id/toggle', authenticate, authorize('admin'), toggleStatusController);

export default router;
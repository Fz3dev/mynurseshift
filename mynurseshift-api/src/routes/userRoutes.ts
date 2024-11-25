import express from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Routes publiques
router.post('/login', userController.login);
router.post('/register', userController.createUser);

// Routes protégées
router.use(authMiddleware.verifyToken);

// Routes pour les admins et super admins
router.get('/', authMiddleware.isAdmin, userController.getAllUsers);
router.get('/:id', authMiddleware.isAdmin, userController.getUserById);
router.put('/:id', authMiddleware.isAdmin, userController.updateUser);
router.delete('/:id', authMiddleware.isAdmin, userController.deleteUser);

// Routes uniquement pour les super admins
router.post('/:id/approve', authMiddleware.isSuperAdmin, userController.approveUser);

export default router;

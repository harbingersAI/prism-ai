import express from 'express';
import { authController } from '../controllers/auth';
import { authenticateJwt } from '../middleware/jwtAuth';

const router = express.Router();

// Public routes
router.post('/signup', authController.signUp);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticateJwt, authController.getProfile);
router.put('/profile', authenticateJwt, authController.updateProfile);
router.post('/logout', authenticateJwt, authController.logout);

export default router;
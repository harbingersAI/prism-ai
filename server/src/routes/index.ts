import { Router } from 'express';
import ai71Routes from './ai71api';
import authRoutes from './auth';
import chatRoutes from './chat';

const router = Router();

router.use('/ai71', ai71Routes);
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);

export default router;
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { changeRoom } from '../controllers/roomControllers';

const router = express.Router();

// Change user room
router.patch('/rooms', authMiddleware, changeRoom);

export default router;

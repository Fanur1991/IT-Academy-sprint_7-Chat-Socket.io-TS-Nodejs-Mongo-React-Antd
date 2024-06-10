import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Get all rooms
router.get('/rooms', authMiddleware);

// Create new room
router.post('/rooms', authMiddleware);

// Delete room
router.delete('/rooms/:roomId', authMiddleware);

export default router;

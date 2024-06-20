import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { searchMessages } from '../controllers/messageControllers';

const router = express.Router();

router.get('/search', authMiddleware, searchMessages);

export default router;

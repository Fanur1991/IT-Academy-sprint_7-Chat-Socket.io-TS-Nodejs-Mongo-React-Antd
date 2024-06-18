import express from 'express';
import { getAllUsers } from '../controllers/userControllers';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// get all users
router.get('/users', authMiddleware, getAllUsers);

export default router;

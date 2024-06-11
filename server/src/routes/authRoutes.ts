import express from 'express';
import {
  getMe,
  login,
  register,
  googleAuth,
} from '../controllers/authControllers';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// register new user
router.post('/register', register);

// login existing user
router.post('/login', login);

// get user
router.get('/api/users/:id', authMiddleware, getMe);

// google auth
router.get('/api/google-auth', googleAuth);

export default router;

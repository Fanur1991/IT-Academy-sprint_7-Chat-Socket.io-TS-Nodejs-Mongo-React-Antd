import { Request, Response } from 'express';
import { ICreateUser, ILoginUser } from '../types/types';
import {
  createUser,
  getUserData,
  loginUser,
  completeGoogleAuthentication,
} from '../services/authServices';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email, room } = req.body as ICreateUser;

    const newUser = await createUser({ username, password, email, room });

    if (!newUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const userData = JSON.stringify({
      username: newUser.username,
      email: newUser.email,
      userId: newUser._id,
      room: newUser.room,
    });

    res.cookie('userData', userData, { httpOnly: false });

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error: any) {
    const message = (error as Error).message || 'Internal Server Error';
    console.error('Register Error:', message);
    return res.status(500).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as ILoginUser;

    const user = await loginUser({ email, password });

    if (!user) {
      res.status(400).json({ message: 'Failed to login' });
      return;
    }

    const userData = JSON.stringify({
      username: user.username,
      email: user.email,
      userId: user._id,
      room: user.room,
    });

    res.cookie('userData', userData, { httpOnly: false });

    res.status(200).json({
      message: 'Login successful',
      user,
    });
  } catch (error: any) {
    const message = (error as Error).message || 'Internal Server Error';
    console.error('Login Error:', message);
    return res.status(500).json({ message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.cookies.userData) {
      res.status(302).json({ message: 'Cookie not found' });
      return;
    }

    const { email } = JSON.parse(req.cookies.userData);

    const user = await getUserData(email);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      user,
    });
  } catch (error: unknown) {
    const message = (error as Error).message || 'Internal Server Error';
    console.error('GetMe Error:', message);
    return res.status(500).json({ message });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    const user = await completeGoogleAuthentication(code);

    const userData = JSON.stringify(user);
    res.cookie('userData', userData, {
      httpOnly: false,
    });

    res.redirect(301, 'http://localhost:5173');
  } catch (error: any) {
    console.error('Authentication error:', error);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

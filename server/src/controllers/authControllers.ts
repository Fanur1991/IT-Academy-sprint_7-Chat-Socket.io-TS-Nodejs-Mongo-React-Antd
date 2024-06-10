import { Request, Response } from 'express';
import { ICreateUser, ILoginUser } from '../types.d';
import { createUser, getUserData, loginUser } from '../services/authServices';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const client = new OAuth2Client(CLIENT_ID);

async function verifyToken(token: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error("Failed to verify token:", error);
    throw new Error("Failed to verify token");
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email, room } = req.body as ICreateUser;

    const newUser = await createUser({ username, password, email, room });

    if (!newUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error: unknown) {
    const message = (error as Error).message || 'Internal Server Error';
    console.error('Register Error:', message);
    return res.status(500).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, room, password } = req.body as ILoginUser;

    const user = await loginUser({ email, room, password });

    if (!user) {
      res.status(400).json({ message: 'Failed to login' });
      return;
    }

    res.status(200).json({
      message: 'Login successful',
      user,
    });
  } catch (error: unknown) {
    console.error('Error:', error);
    const message = (error as Error).message || 'Internal Server Error';
    console.error('Login Error:', message);
    return res.status(500).json({ message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const user = await getUserData(id);

    if (!user) {
      res.status(400).json({ message: 'Failed to authentication' });
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
    const token = req.headers.authorization as string;

    const userInfo = await verifyToken(token);
    if (!userInfo) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    // Handle successful authentication here (e.g., create user session, return user data)
    res
      .status(200)
      .json({ message: 'Authentication successful', user: userInfo });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

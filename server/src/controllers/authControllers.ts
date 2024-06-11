import { Request, Response } from 'express';
import { ICreateUser, ILoginUser } from '../types.d';
import {
  createUser,
  getUserData,
  getGoogleAuthTokens,
  loginUser,
  getGoogleUser,
  findAndUpdateUser,
  hashPassword,
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
    const { email, password } = req.body as ILoginUser;

    const user = await loginUser({ email, password });

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
    // Get the code from qs
    const code = req.query.code as string;

    // Get the id_token and access_token with the code
    const { id_token, access_token } = await getGoogleAuthTokens({ code });

    // Get the user info with the id_token
    const googleUser = await getGoogleUser({ id_token, access_token });

    console.log('GOOGLE USER:', googleUser.email);

    if (!googleUser) {
      return res
        .status(403)
        .json({ message: 'Google account is not verified' });
    }

    // upsert the user
    const hashedPassword = await hashPassword(googleUser.id);

    const user = await findAndUpdateUser(
      { email: googleUser.email },
      {
        $set: {
          email: googleUser.email,
          username: googleUser.name,
          passwordHash: hashedPassword,
        },
      },
      { upsert: true, new: true }
    );

    // add the user
    const newUser = await createUser({
      username: googleUser.name,
      email: googleUser.email,
      password: googleUser.id,
      room: googleUser.locale,
    });

    // redirect back to the client
    res.redirect(`${process.env.CLIENT_URL}`);
  } catch (error: any) {
    console.error('Authentication error:', error);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
};

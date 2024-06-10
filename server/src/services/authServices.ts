import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import {
  ComparedPassword,
  HashPassword,
  ICreateUser,
  IGetUser,
  ILoginUser,
  IUser,
  Token,
  VerifiedToken,
} from '../types.d';
import UserModel from '../models/UserModel';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET as string;

const hashPassword = async (password: string): Promise<HashPassword> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePasswords = async (
  password: string,
  passwordHash: string
): Promise<ComparedPassword> => {
  return await bcrypt.compare(password, passwordHash);
};

const createToken = (userId: string): Token => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '1d',
  });
};

export const verifyToken = (token: string): string | VerifiedToken => {
  return jwt.verify(token, JWT_SECRET);
};

export const createUser = async (userData: ICreateUser): Promise<IUser> => {
  const { username, password, email, room } = userData;
  try {
    const foundUser = await UserModel.findOne({ email });

    if (foundUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await UserModel.create({
      username,
      passwordHash: hashedPassword,
      email,
      room,
    });

    return {
      _id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      room: newUser.room,
      token: createToken(newUser._id.toString()),
    };
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to create user due to internal error');
  }
};

export const loginUser = async (userData: ILoginUser): Promise<IUser> => {
  try {
    const { email, password, room } = userData;

    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      throw new Error('User not found');
    }

    const comparedPassword = await comparePasswords(
      password,
      foundUser.passwordHash
    );

    if (comparedPassword) {
      return {
        _id: foundUser._id.toString(),
        username: foundUser.username,
        email: foundUser.email,
        room: foundUser.room,
        token: createToken(foundUser._id.toString()),
      };
    } else {
      return Promise.reject(new Error('User not found'));
    }
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to create user due to internal error');
  }
};

export const getUserData = async (_id: string): Promise<IGetUser> => {
  try {
    const foundUser = await UserModel.findById(_id);

    if (!foundUser) {
      throw new Error('User not found');
    }

    return {
      _id: foundUser._id.toString(),
      username: foundUser.username,
      email: foundUser.email,
      room: foundUser.room,
    };
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to create user due to internal error');
  }
};

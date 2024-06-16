import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import {
  ComparedPassword,
  HashPassword,
  ICreateUser,
  ILoginUser,
  IGetUser,
  IUser,
  Token,
  VerifiedToken,
} from '../types/types';
import qs from 'qs';
import UserModel from '../models/UserModel';
import axios from 'axios';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET as string;

export const hashPassword = async (password: string): Promise<HashPassword> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  passwordHash: string
): Promise<ComparedPassword> => {
  return await bcrypt.compare(password, passwordHash);
};

export const createToken = (userId: string): Token => {
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
      isGoogleAccount: false,
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
    const { email, password } = userData;

    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      throw new Error('User not found');
    }

    if (foundUser.isGoogleAccount) {
      return {
        _id: foundUser._id.toString(),
        username: foundUser.username,
        email: foundUser.email,
        room: foundUser.room,
        token: createToken(foundUser._id.toString()),
      };
    }

    if (!foundUser.passwordHash) {
      return Promise.reject(new Error('No password set for user'));
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
      return Promise.reject(new Error('Incorrect password'));
    }
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to create user due to internal error');
  }
};

export const getUserData = async (email: string): Promise<IGetUser> => {
  try {
    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      throw new Error('User not found');
    }

    return {
      _id: foundUser._id.toString(),
      username: foundUser.username,
      email: foundUser.email,
      room: foundUser.room,
      isGoogleAccount: foundUser.isGoogleAccount,
    };
  } catch (error: any) {
    if (error.message) {
      throw error;
    }
    throw new Error('Failed to create user due to internal error');
  }
};

interface GoogleTokenResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export const getGoogleAuthTokens = async ({
  code,
}: {
  code: string;
}): Promise<GoogleTokenResult> => {
  const url = 'https://oauth2.googleapis.com/token';

  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    grant_type: 'authorization_code',
  };

  try {
    const res = await axios.post<GoogleTokenResult>(url, qs.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return res.data;
  } catch (error: any) {
    console.error(error, 'Failed to fetch Google access token');
    throw new Error('Failed to fetch Google access token');
  }
};

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export const getGoogleUser = async ({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<GoogleUserResult> => {
  try {
    const res = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error(error, 'Failed to fetch Google user');
    throw new Error('Failed to fetch Google user');
  }
};

export const findAndUpdateUser = async (
  query: any,
  update: any,
  options: any = {}
): Promise<IUser> => {
  try {
    const updatedOptions = { ...options, new: true };
    const result = await UserModel.findOneAndUpdate(
      query,
      update,
      updatedOptions
    ).lean();

    if (!result) {
      throw new Error('No document found with the given query');
    }

    return {
      _id: result._id.toString(),
      username: result.username,
      email: result.email,
      token: createToken(result._id.toString()),
      room: result.room,
      isGoogleAccount: result.isGoogleAccount,
    };
  } catch (error) {
    console.error('Failed to update user:', error);
    throw new Error('Failed to update user');
  }
};

export const completeGoogleAuthentication = async (
  code: string
): Promise<IUser> => {
  // Get the id_token and access_token with the code
  const { id_token, access_token } = await getGoogleAuthTokens({ code });

  // Get the user info with the id_token
  const googleUser = await getGoogleUser({ id_token, access_token });

  if (!googleUser) {
    throw new Error('Google account is not verified');
  }

  const user = await findAndUpdateUser(
    { email: googleUser.email },
    {
      $set: {
        username: googleUser.name,
        email: googleUser.email,
        room: googleUser.locale,
        isGoogleAccount: true,
      },
    },
    { upsert: true, new: true }
  );

  return user;
};

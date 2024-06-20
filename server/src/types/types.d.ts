import 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

declare module 'express' {
  export interface Request {
    user?: {
      _id: Types.ObjectId;
    };
  }
}

export interface ICreateUser {
  username: string;
  password: string;
  email: string;
  room: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  token?: string;
  room: string;
  isGoogleAccount?: boolean;
}

export type IGetUser = Omit<IUser, 'token'>;

export type Token = string;

export type HashPassword = string;

export type ComparedPassword = boolean;

export type VerifiedToken = string | JwtPayload;

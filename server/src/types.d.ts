import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      _id: string;
    };
  }
}

import { JwtPayload } from 'jsonwebtoken';

export interface ICreateUser {
  username: string;
  password: string;
  email: string;
  room: string;
}

export interface ILoginUser {
  email: string;
  room: string;
  password: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  token: string;
  room: string[];
}

export type Token = string;
export type HashPassword = string;
export type ComparedPassword = boolean;
export type VerifiedToken = string | JwtPayload;

export default interface IChatRoom {
  _id: string;
  name: string;
  description: string;
  createdAt: Date;
}

type IGetUser = Omit<IUser, 'token'>;

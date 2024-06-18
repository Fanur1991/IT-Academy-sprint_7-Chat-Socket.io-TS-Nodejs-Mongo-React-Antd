import UserModel from '../models/UserModel';
import { IUser } from '../types/types';

export const getUsers = async (room: string): Promise<IUser[]> => {
  try {
    const users = await UserModel.find({ room });

    if (!users.length) {
      throw new Error('Users not found');
    }

    return users;
  } catch (error: any) {
    console.error('Error while getting users:', error.message);
    throw new Error('Error while getting users');
  }
};

import { Types } from 'mongoose';
import UserModel from '../models/UserModel';
import { IUser } from '../types/types';
import { createToken } from './authServices';

export const changeUserRoom = async (
  userId: Types.ObjectId,
  room: string
): Promise<IUser> => {
  try {
    const foundUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        room,
      },
      {
        new: true,
      }
    );

    if (!foundUser) {
      throw new Error('User not found');
    }

    return {
      _id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
      room: foundUser.room,
      token: createToken(foundUser._id),
      isGoogleAccount: foundUser.isGoogleAccount,
    };
  } catch (error: any) {
    console.error('Error while changing room:', error.message);
    throw new Error('Error while changing room');
  }
};

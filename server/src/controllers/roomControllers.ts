import { Request, Response } from 'express';
import { changeUserRoom } from '../services/chatRoomServices';
import { IUser } from '../types/types';
import { Types } from 'mongoose';

export const changeRoom = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    console.log(req.cookies);
    const { room } = req.body as { room: string };
    const userData = JSON.parse(req.cookies.userData) as IUser;
    const userId = userData._id as Types.ObjectId;

    const rooms = await changeUserRoom(userId, room);

    if (!rooms) {
      res.status(400).json({ message: 'Failed to change room' });
    }

    res.status(200).json(rooms);
  } catch (error: any) {
    console.error('Error while changing room:', error.message);
    res
      .status(500)
      .json({ message: 'Error while changing room', error: error.message });
  }
};

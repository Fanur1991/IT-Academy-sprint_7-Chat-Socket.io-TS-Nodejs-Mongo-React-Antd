import { Request, Response } from 'express';
import { getUsers } from '../services/userServices';

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {room} = JSON.parse(req.cookies.userData);

    if (!room) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const users = await getUsers(room);

    res.status(200).json(users);
  } catch (error: any) {
    console.error('Error while getting users:', error.message);
    res
      .status(500)
      .json({ message: 'Error while getting users', error: error.message });
  }
};

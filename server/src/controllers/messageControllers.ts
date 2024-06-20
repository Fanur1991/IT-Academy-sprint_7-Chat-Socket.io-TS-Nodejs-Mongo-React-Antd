import { Request, Response } from 'express';
import { searchRoomMessages } from '../services/messageServices';

export const searchMessages = async (req: Request, res: Response) => {
  try {
    const { room, query }: { room: string; query: string } = req.query as {
      room: string;
      query: string;
    };

    if (!room || !query) {
      return res.status(400).json({ message: 'Room and query are required' });
    }

    const messages = await searchRoomMessages(room, query);

    res.status(200).json(messages);
  } catch (error) {
    console.error('Failed to search messages:', error);
    res.status(500).json({ message: 'Failed to search messages' });
  }
};

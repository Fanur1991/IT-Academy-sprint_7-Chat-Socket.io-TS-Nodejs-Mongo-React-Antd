import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authServices';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      res.status(401).json({ message: 'Authorization header is missing' });
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res
        .status(401)
        .json({ message: 'Authorization token must be Bearer token' });
      return;
    }

    const token = parts[1];
    const decodedToken = (await verifyToken(token)) as {
      _id: string;
    };

    if (!decodedToken) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    req.user = { _id: decodedToken._id };
    next();
  } catch (error: any) {
    console.error('Token verification error:', error);
    res.status(403).json({ message: 'Invalid token', error: error.message });
  }
};

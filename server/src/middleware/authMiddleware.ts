import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authServices';
import { Types } from 'mongoose';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header('Authorization');
    const userData = req.cookies.userData;

    let token;

    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res
          .status(401)
          .json({ message: 'Authorization token must be Bearer token' });
        return;
      }
      token = parts[1];
    } else if (userData) {
      token = JSON.parse(userData).token;
    } else {
      res.status(401).json({ message: 'Error: Authorization token not found' });
      return;
    }
    const decodedToken = (await verifyToken(token)) as {
      _id: Types.ObjectId;
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

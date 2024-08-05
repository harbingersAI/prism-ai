import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/jwt';
import { authService } from '../services/auth';
import { IUserProfile } from '../types/auth';

declare global {
  namespace Express {
    interface Request {
      user?: IUserProfile;
    }
  }
}

export const authenticateJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {     
      return res.status(401).json({ message: 'No token provided' });

    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {     
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.sub) {    
      return res.status(401).json({ message: 'Invalid token' });
    }

    try {
      const user = await authService.getUserProfile(decoded.sub);
      req.user = user;
      next();
    } catch (error) { 
      return res.status(401).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Token expired') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const optionalAuthenticateJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return next();
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.sub) {
      return next();
    }

    try {
      const user = await authService.getUserProfile(decoded.sub);
      req.user = user;
    } catch (error) {
      // If user not found, we just proceed without setting the user
    }

    next();
  } catch (error) {
    // If there's an error with the token, we just proceed without setting the user
    next();
  }
};
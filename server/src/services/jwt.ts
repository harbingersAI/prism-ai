import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../types/auth';
import config from '../config';

const secret = config.jwt.secret;
const expiresIn = config.jwt.expiresIn;

if (!secret) {
  throw new Error('JWT secret is not defined in the configuration');
}

export function generateToken(userId: string, email: string): string {
  const payload: IJwtPayload = {
    sub: userId,
    email: email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + parseInt(expiresIn, 10),
  };

  return jwt.sign(payload, secret);
}

export function verifyToken(token: string): IJwtPayload {
  try {
    const decoded = jwt.verify(token, secret) as IJwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    } else {
      throw new Error('Failed to verify token');
    }
  }
}

export function decodeToken(token: string): IJwtPayload | null {
  try {
    return jwt.decode(token) as IJwtPayload;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}
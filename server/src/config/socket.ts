import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../services/jwt';
import { authService } from '../services/auth';
import logger from './logger';

export const configureSocket = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:4000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    const apiKey = socket.handshake.auth.apiKey;
    const uuid = socket.handshake.auth.uuid;

    if (!token || !apiKey || !uuid) {
      return next(new Error('Authentication error'));
    }

    try {
      // Verify JWT token
      const decoded = verifyToken(token);
      if (!decoded || !decoded.sub) {
        return next(new Error('Invalid token'));
      }

      // Verify API key
      if (apiKey !== process.env.API_KEY) {
        return next(new Error('Invalid API key'));
      }

      // Get user profile
      const user = await authService.getUserProfile(decoded.sub);
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.user = user;
      socket.data.uuid = uuid;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  return io;
};
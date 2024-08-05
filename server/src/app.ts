import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import config from './config';
import logger from './config/logger';
import apiKeyAuth from './middleware/dasAuth';
import rateLimiter from './middleware/rateLimiter';
import routes from './routes';
import { configureSocket } from './config/socket';
import { SocketService } from './services/socketService';

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));
app.use(express.json());
app.use(rateLimiter);
app.use(apiKeyAuth);

// Routes
app.use('/api', routes);

// Socket.io setup
const io = configureSocket(httpServer);
new SocketService(io);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

export { app, httpServer };
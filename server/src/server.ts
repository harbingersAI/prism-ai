import { httpServer } from './app';
import config from './config';
import logger from './config/logger';

const server = httpServer.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
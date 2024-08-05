import { Request, Response, NextFunction } from 'express';
import config from '../config';
import logger from '../config/logger';

const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.get('X-API-Key');
  
  logger.debug(`Received X-API-Key header: ${apiKey}`);
  logger.debug(`Expected API key: ${config.apiKey}`);

  if (!apiKey || apiKey !== config.apiKey) {
    logger.warn('Unauthorized access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

export default apiKeyAuth;

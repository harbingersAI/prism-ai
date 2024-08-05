import { Router, Request, Response } from 'express';
import { generateAI71Response } from '../services/ai71';
import { AI71Request } from '../types/ai71';
import logger from '../config/logger';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const aiRequest: AI71Request = {
      model: req.body.model || 'tiiuae/falcon-180b-chat',
      messages: req.body.messages || [],
    };

    if (!aiRequest.messages || aiRequest.messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    const aiResponse = await generateAI71Response(aiRequest);
    res.json(aiResponse);
  } catch (error) {
    logger.error('Error in AI71 chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
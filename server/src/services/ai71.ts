import axios from 'axios';
import config from '../config';
import logger from '../config/logger';
import { AI71Request, AI71Response } from '../types/ai71';

const AI71_API_URL = 'https://api.ai71.ai/v1/chat/completions';

export async function generateAI71Response(request: AI71Request): Promise<AI71Response> {
  try {
    const response = await axios.post<AI71Response>(AI71_API_URL, request, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.ai71ApiKey}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to generate AI response');
  }
}
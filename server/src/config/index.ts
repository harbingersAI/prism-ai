import dotenv from 'dotenv';
import supabaseConfig from './supabase';

dotenv.config();

export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiKey: process.env.API_KEY || 'default_api_key',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4000',
  ai71ApiKey: process.env.AI71_API_KEY || '',
  supabase: supabaseConfig,
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '36000',
  },
};
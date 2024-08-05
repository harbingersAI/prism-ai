import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../utils/Api';
import { removeAuthToken } from '../../utils/cookieHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await api.logout();
    
    // Remove the auth token cookie
    removeAuthToken({ req, res });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message || 'Failed to logout' });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred during logout' });
    }
  }
}
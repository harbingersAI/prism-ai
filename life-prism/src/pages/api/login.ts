import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../utils/Api';
import { setAuthToken } from '../../utils/cookieHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const response = await api.login(email, password);

    // Set the auth token in a cookie
    setAuthToken(response.data.session.access_token, { req, res });

    // Return user data without sensitive information
    const { user } = response.data;
    const safeUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      username: user.username,
    };

    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      res.status(401).json({ message: error.message || 'Invalid credentials' });
    } else {
      res.status(401).json({ message: 'An unexpected error occurred' });
    }
  }
}
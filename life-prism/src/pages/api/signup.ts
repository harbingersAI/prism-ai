import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../utils/Api';
import { setAuthToken } from '../../utils/cookieHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, password, full_name } = req.body;
    console.log(req.body);

    if (!email || !password || !full_name) {
      return res.status(400).json({ message: 'Email, password, and full name are required' });
    }

    console.log('Attempting to sign up with:', { email, full_name });

    const response = await api.signup(email, password, full_name);

    console.log('Signup response:', response);
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

    res.status(201).json({ user: safeUser });
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message || 'Failed to create account' });
    } else {
      res.status(400).json({ message: 'An unexpected error occurred' });
    }
  }
}
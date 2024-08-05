import { NextApiRequest, NextApiResponse } from 'next';
import api from '../../utils/Api';
import { getAuthToken } from '../../utils/cookieHandler';
import { IUpdateProfileData } from '../../types/auth'; // Make sure this import path is correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getAuthToken({ req, res });

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const response = await api.getProfile();
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Get profile error:', error);
      if (error instanceof Error) {
        res.status(500).json({ message: error.message || 'Failed to fetch profile' });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred while fetching the profile' });
      }
    }
  } else if (req.method === 'PUT') {
    try {
      const { full_name, timezone, language_preference, marketing_opt_in } = req.body;
      
      const updateData: Partial<IUpdateProfileData> = {
        full_name,
        timezone,
        language_preference,
        marketing_opt_in,
      };

      // Remove undefined fields
      const cleanedUpdateData: Partial<IUpdateProfileData> = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      ) as Partial<IUpdateProfileData>;

      const response = await api.updateProfile(cleanedUpdateData);
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Update profile error:', error);
      if (error instanceof Error) {
        res.status(500).json({ message: error.message || 'Failed to update profile' });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred while updating the profile' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
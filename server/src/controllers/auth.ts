import { Request, Response } from 'express';
import { authService } from '../services/auth';
import { ISignUpRequest, ILoginRequest, IUpdateProfileRequest } from '../types/auth';

export const authController = {
  async signUp(req: Request, res: Response) {
    try {

      const signUpData: ISignUpRequest = req.body;
      const result = await authService.signUp(signUpData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  },

  async login(req: Request, res: Response) {
    try {     
      const loginData: ILoginRequest = req.body;
      const result = await authService.login(loginData);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        console.log("User is missing");
        return res.status(401).json({ message: 'Authentication required' });
      }
      const profileData: IUpdateProfileRequest = req.body;
      console.log("attempting to update profile");
      const result = await authService.updateProfile(req.user.user_id, profileData);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const userProfile = await authService.getUserProfile(req.user.user_id);
      res.status(200).json(userProfile);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  },

  async logout(req: Request, res: Response) {
    try {
      // Since we're using JWT, we don't need to do anything server-side for logout
      // The client should remove the token from storage
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};
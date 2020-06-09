import { Request, Response } from 'express';
import { APIResponse } from '../interfaces';

type LogoutResponse = APIResponse;
export const logout = async (req: Request, res: Response<LogoutResponse>): Promise<void> => {
  try {
    res.cookie('token', 'fakeFakeToken', {
      httpOnly: true,
      maxAge: 0,
      sameSite: 'strict',
    });

    res.cookie('signedIn', 'true', {
      maxAge: 0,
      sameSite: 'strict',
    });

    res.json({ message: 'Logout successful!' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
    console.error(err);
  }
};

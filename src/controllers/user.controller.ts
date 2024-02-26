import { Request, Response } from 'express';
import { registerUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, fingerprint } = req.body;
    const result = await registerUser(email, password, fingerprint);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error});
  }
};
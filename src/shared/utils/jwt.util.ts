import jwt from 'jsonwebtoken';

export const generateJWT = (userId: string, fingerprint: string) => {
  const payload = { userId, fingerprint };
  return jwt.sign(payload, process.env.JWT_SECRET || 'your_secret', { expiresIn: '1d' });
};
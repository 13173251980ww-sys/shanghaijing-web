import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'shanghaijing-admin-secret';

export function generateToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
}

export function authMiddleware(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new UnauthorizedError('NOT_LOGGED_IN');
  }
  try {
    jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    throw new UnauthorizedError('TOKEN_EXPIRED');
  }
}

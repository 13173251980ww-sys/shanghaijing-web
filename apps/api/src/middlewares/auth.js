// JWT 认证中间件：生成 token 与验证请求
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError.js';

// JWT 密钥，生产环境通过环境变量注入
const JWT_SECRET = process.env.JWT_SECRET || 'shanghaijing-admin-secret';

/** 生成管理员登录 token，有效期 7 天 */
export function generateToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
}

/** 认证中间件：从 Authorization 头提取并验证 Bearer token */
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

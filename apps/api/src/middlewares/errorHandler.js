// Express 统一错误处理中间件
import { AppError, ERRORS } from '../errors/AppError.js';

/**
 * 全局错误处理：
 * - AppError（业务异常）→ 返回对应的 code / status / message
 * - MulterError → 文件上传异常
 * - Payload Too Large → 413 文件过大
 * - 其他未知异常 → 500，生产环境不暴露错误详情
 */
export default function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
  }

  if (err.name === 'MulterError') {
    return res.status(ERRORS.INVALID_IMAGE_FILE.status).json({
      code: ERRORS.INVALID_IMAGE_FILE.code,
      message: `文件上传失败: ${err.message}`,
    });
  }

  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      code: ERRORS.INVALID_IMAGE_FILE.code,
      message: '文件过大，请压缩后重试',
    });
  }

  console.error('[ERROR]', err);

  const isProd = process.env.NODE_ENV === 'production';
  res.status(ERRORS.INTERNAL.status).json({
    code: ERRORS.INTERNAL.code,
    message: isProd ? ERRORS.INTERNAL.message : err.message,
  });
}

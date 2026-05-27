/**
 * 错误定义字典 —— 所有业务异常的唯一来源
 * 新增错误时在此追加，然后在 throw 处引用 key 即可
 */
export const ERRORS = {
  // ---- 认证 (A) ----
  NOT_LOGGED_IN:          { code: 'A0001', status: 401, label: '未登录 / token 过期', message: '未登录，请先登录' },
  TOKEN_EXPIRED:           { code: 'A0001', status: 401, label: '未登录 / token 过期', message: '登录已过期，请重新登录' },
  INVALID_CREDENTIALS:     { code: 'A0002', status: 401, label: '账号或密码错误',       message: '账号或密码错误' },

  // ---- 参数校验 (B0001) ----
  VALIDATION:              { code: 'B0001', status: 400, label: '参数校验失败',         message: '请求参数有误' },
  MISSING_FILENAME_URL:    { code: 'B0001', status: 400, label: '参数校验失败',         message: '缺少 filename 或 url' },
  TITLE_REQUIRED:          { code: 'B0001', status: 400, label: '参数校验失败',         message: '标题不能为空' },
  NAME_URL_REQUIRED:       { code: 'B0001', status: 400, label: '参数校验失败',         message: '名称和链接不能为空' },
  NAME_DESC_URL_REQUIRED:  { code: 'B0001', status: 400, label: '参数校验失败',         message: '名称、描述和链接不能为空' },
  AUTHOR_CONTENT_REQUIRED: { code: 'B0001', status: 400, label: '参数校验失败',         message: '署名和内容不能为空' },
  IDS_ARRAY_REQUIRED:      { code: 'B0001', status: 400, label: '参数校验失败',         message: 'ids 需为数组' },
  IDS_NON_EMPTY_ARRAY:     { code: 'B0001', status: 400, label: '参数校验失败',         message: 'ids 需为非空数组' },

  // ---- 资源不存在 (B0002) ----
  NOT_FOUND:               { code: 'B0002', status: 404, label: '资源不存在',           message: '资源不存在' },
  IMAGE_NOT_FOUND:         { code: 'B0002', status: 404, label: '资源不存在',           message: '图片不存在' },
  POST_NOT_FOUND:          { code: 'B0002', status: 404, label: '资源不存在',           message: '文章不存在' },
  FRIEND_NOT_FOUND:        { code: 'B0002', status: 404, label: '资源不存在',           message: '友链不存在' },
  MESSAGE_NOT_FOUND:       { code: 'B0002', status: 404, label: '资源不存在',           message: '留言不存在' },
  PROJECT_NOT_FOUND:       { code: 'B0002', status: 404, label: '资源不存在',           message: '项目不存在' },

  // ---- 文件上传 (B0003) ----
  INVALID_IMAGE_FILE:      { code: 'B0003', status: 400, label: '文件上传失败',         message: '请选择有效的图片文件' },

  // ---- 服务端 (C) ----
  INTERNAL:                { code: 'C0001', status: 500, label: '服务器内部错误',       message: '服务器内部错误' },
};

/**
 * 业务异常基类 — 子类构造函数只接收 ERRORS 中的 key
 */
export class AppError extends Error {
  constructor(key) {
    const def = ERRORS[key];
    super(def.message);
    this.statusCode = def.status;
    this.code = def.code;
    this.isOperational = true;
  }
}

export class BadRequestError extends AppError {
  constructor(key = 'VALIDATION') { super(key); }
}

export class UnauthorizedError extends AppError {
  constructor(key = 'NOT_LOGGED_IN') { super(key); }
}

export class NotFoundError extends AppError {
  constructor(key = 'NOT_FOUND') { super(key); }
}

/**
 * 错误码登记表 —— 从 ERRORS 去重派生，供前端 API 文档页展示
 */
export const errorCodeRegistry = (() => {
  const seen = new Set();
  const list = [];
  for (const def of Object.values(ERRORS)) {
    if (!seen.has(def.code)) {
      seen.add(def.code);
      list.push({ code: def.code, status: def.status, label: def.label });
    }
  }
  return list;
})();

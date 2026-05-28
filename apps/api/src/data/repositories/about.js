// 关于页数据仓库：个人信息单行记录的读写
import { getDb } from '../db.js';

// 映射数据库下划线字段为驼峰命名
function aboutRow(r) {
  return {
    nickname: r.nickname, school: r.school,
    githubUrl: r.github_url, csdnUrl: r.csdn_url,
    social: r.social, avatarUrl: r.avatar_url,
  };
}

export function getAbout() {
  const row = getDb().prepare('SELECT * FROM about WHERE id = 1').get();
  return row ? aboutRow(row) : {};
}

// 使用 UPSERT 更新个人信息（单行记录，id 恒为 1）
export function updateAbout(fields) {
  const current = getDb().prepare('SELECT * FROM about WHERE id = 1').get() || {};
  getDb().prepare(`
    INSERT INTO about (id, nickname, school, github_url, csdn_url, social, avatar_url)
    VALUES (1, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (id) DO UPDATE SET
      nickname = COALESCE(excluded.nickname, about.nickname),
      school = COALESCE(excluded.school, about.school),
      github_url = COALESCE(excluded.github_url, about.github_url),
      csdn_url = COALESCE(excluded.csdn_url, about.csdn_url),
      social = COALESCE(excluded.social, about.social),
      avatar_url = COALESCE(excluded.avatar_url, about.avatar_url)
  `).run(
    fields.nickname !== undefined ? fields.nickname : current.nickname || '',
    fields.school !== undefined ? fields.school : current.school || '',
    fields.githubUrl !== undefined ? fields.githubUrl : current.github_url || '',
    fields.csdnUrl !== undefined ? fields.csdnUrl : current.csdn_url || '',
    fields.social !== undefined ? fields.social : current.social || '',
    fields.avatarUrl !== undefined ? fields.avatarUrl : current.avatar_url || '',
  );
  return getAbout();
}

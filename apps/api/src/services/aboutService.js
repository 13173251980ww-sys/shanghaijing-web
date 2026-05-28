// 关于页业务逻辑：个人信息的获取与更新
import { getAbout, updateAbout } from '../data/repositories/about.js';

export function getAboutInfo() {
  return getAbout();
}

export function editAbout(fields) {
  return updateAbout(fields);
}

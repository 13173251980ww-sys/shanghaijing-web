import { getAbout, updateAbout } from '../data/repositories/about.js';

export function getAboutInfo() {
  return getAbout();
}

export function editAbout(fields) {
  return updateAbout(fields);
}

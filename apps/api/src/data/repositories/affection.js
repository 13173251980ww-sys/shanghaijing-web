import { getDb } from '../db.js';

export function getAffection() {
  const row = getDb().prepare('SELECT affection, last_login_date FROM user_affection WHERE id = 1').get();
  if (!row) {
    getDb().prepare('INSERT INTO user_affection (id, affection, last_login_date) VALUES (1, 0, ?)').run('');
    return { affection: 0, lastLoginDate: '' };
  }
  return { affection: row.affection, lastLoginDate: row.last_login_date };
}

export function addDailyAffection() {
  const today = new Date().toISOString().slice(0, 10);
  const current = getAffection();

  if (current.lastLoginDate === today) {
    return { affection: current.affection, changed: false };
  }

  const newAffection = current.affection + 1;
  getDb().prepare('UPDATE user_affection SET affection = ?, last_login_date = ? WHERE id = 1').run(newAffection, today);
  return { affection: newAffection, changed: true };
}

const LEVELS = [
  { min: 0,  max: 5,   level: 1, title: '初识' },
  { min: 6,  max: 15,  level: 2, title: '相识' },
  { min: 16, max: 30,  level: 3, title: '熟络' },
  { min: 31, max: 50,  level: 4, title: '知己' },
  { min: 51, max: Infinity, level: 5, title: '莫逆' },
];

export function getAffectionLevel(affection) {
  const tier = LEVELS.find(l => affection >= l.min && affection <= l.max);
  return tier || LEVELS[0];
}

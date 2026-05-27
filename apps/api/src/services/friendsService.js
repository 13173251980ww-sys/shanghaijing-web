import { listFriends, addFriend, updateFriend, removeFriend } from '../data/repositories/friends.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

export function getFriends() {
  return listFriends();
}

export function createFriend(name, url) {
  if (!name || !url) throw new BadRequestError('NAME_URL_REQUIRED');
  return addFriend(name, url);
}

export function editFriend(id, fields) {
  const link = updateFriend(id, fields);
  if (!link) throw new NotFoundError('FRIEND_NOT_FOUND');
  return link;
}

export function deleteFriend(id) {
  if (!removeFriend(id)) throw new NotFoundError('FRIEND_NOT_FOUND');
}

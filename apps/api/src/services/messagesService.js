// 留言业务逻辑：校验与 CRUD 委托
import { listMessages, addMessage, removeMessage } from '../data/repositories/messages.js';
import { BadRequestError, NotFoundError } from '../errors/AppError.js';

export function getMessages() {
  return listMessages();
}

export function createMessage(author, content) {
  if (!author || !content) throw new BadRequestError('AUTHOR_CONTENT_REQUIRED');
  return addMessage(author, content);
}

export function deleteMessage(id) {
  if (!removeMessage(id)) throw new NotFoundError('MESSAGE_NOT_FOUND');
}

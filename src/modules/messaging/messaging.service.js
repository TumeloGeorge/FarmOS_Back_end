const repo = require('./messaging.repository');
const logger = require('../../utils/logger');
const {
  ConversationNotFound,
  ConversationArchived,
  DuplicateConversation,
  AlreadyMember,
  NotConversationMember,
  CannotEditOthersMessage,
  CannotDeleteOthersMessage,
  MessageNotFound
} = require('./messaging.errors');
const { ConversationTypes, MessageTypes } = require('./messaging.constants');

const buildMessageDto = (message) => ({
  messageId: message.message_id,
  conversationId: message.conversation_id,
  senderId: message.sender_id,
  senderName: message.sender_name,
  messageType: message.message_type,
  body: message.body,
  replyTo: message.reply_to,
  isEdited: message.is_edited,
  createdAt: message.created_at,
  readBy: message.read_by || []
});

const buildConversationDto = (conversation) => ({
  conversationId: conversation.conversation_id,
  farmId: conversation.farm_id,
  title: conversation.title,
  conversationType: conversation.conversation_type,
  lastMessage: conversation.last_message || null,
  unreadCount: conversation.unread_count || 0
});

exports.createConversation = async (userId, payload) => {
  const { farmId, title, conversationType, participantIds = [] } = payload;

  if (conversationType === ConversationTypes.DIRECT) {
    if (!participantIds || participantIds.length !== 1) {
      throw new Error('Direct conversations require exactly one participant');
    }
    const duplicate = await repo.findDirectConversationByParticipants(farmId, userId, participantIds[0]);
    if (duplicate) {
      throw new DuplicateConversation();
    }
  } else {
    const duplicate = await repo.findConversationByTitle(farmId, title);
    if (duplicate) {
      throw new DuplicateConversation();
    }
  }

  const conversation = await repo.createConversation({
    farmId,
    title,
    conversationType,
    createdBy: userId
  });

  await repo.addMember(conversation.conversation_id, userId);

  const members = Array.from(new Set([userId, ...(participantIds || [])]));
  await Promise.all(
    members
      .filter((memberId) => memberId !== userId)
      .map((memberId) => repo.addMember(conversation.conversation_id, memberId))
  );

  logger.info('Conversation Created', { conversationId: conversation.conversation_id, farmId, createdBy: userId });
  return buildConversationDto(conversation);
};

exports.sendMessage = async (userId, conversationId, payload) => {
  const conversation = await repo.findConversationForUser(conversationId, userId);
  if (!conversation) throw new ConversationNotFound();
  if (conversation.archived) throw new ConversationArchived();

  if (payload.replyTo) {
    const reply = await repo.findMessageById(payload.replyTo);
    if (!reply || reply.conversation_id !== conversationId) {
      throw new MessageNotFound();
    }
  }

  const message = await repo.createMessage({
    conversationId,
    senderId: userId,
    body: payload.body,
    messageType: payload.messageType || MessageTypes.TEXT,
    replyTo: payload.replyTo || null
  });

  logger.info('Message Sent', { messageId: message.message_id, conversationId, senderId: userId });
  return buildMessageDto({ ...message, sender_name: null, read_by: [] });
};

exports.editMessage = async (userId, messageId, payload) => {
  const message = await repo.findMessageById(messageId);
  if (!message) throw new MessageNotFound();
  if (message.sender_id !== userId) throw new CannotEditOthersMessage();

  const updated = await repo.updateMessage(messageId, payload.body);
  logger.info('Message Edited', { messageId, conversationId: updated.conversation_id, editedBy: userId });
  return buildMessageDto({ ...updated, sender_name: null, read_by: [] });
};

exports.deleteMessage = async (userId, messageId) => {
  const message = await repo.findMessageById(messageId);
  if (!message) throw new MessageNotFound();
  if (message.sender_id !== userId) throw new CannotDeleteOthersMessage();

  const deleted = await repo.deleteMessage(messageId);
  logger.info('Message Deleted', { messageId, conversationId: deleted.conversation_id, deletedBy: userId });
  return { messageId: deleted.message_id, deletedAt: deleted.deleted_at };
};

exports.addConversationMember = async (userId, conversationId, memberId) => {
  const conversation = await repo.findConversationForUser(conversationId, userId);
  if (!conversation) throw new ConversationNotFound();

  const alreadyMember = await repo.isUserInConversation(conversationId, memberId);
  if (alreadyMember) throw new AlreadyMember();

  await repo.addMember(conversationId, memberId);
  logger.info('Member Added', { conversationId, addedBy: userId, memberId });
  return { conversationId, userId: memberId };
};

exports.removeConversationMember = async (userId, conversationId, memberId) => {
  const conversation = await repo.findConversationForUser(conversationId, userId);
  if (!conversation) throw new ConversationNotFound();

  const member = await repo.isUserInConversation(conversationId, memberId);
  if (!member) throw new NotConversationMember();

  await repo.removeMember(conversationId, memberId);
  logger.info('Member Removed', { conversationId, removedBy: userId, memberId });
  return { conversationId, userId: memberId };
};

exports.markAsRead = async (userId, messageId) => {
  const conversationId = await repo.findConversationIdByMessageId(messageId);
  if (!conversationId) throw new MessageNotFound();

  const isMember = await repo.isUserInConversation(conversationId, userId);
  if (!isMember) throw new NotConversationMember();

  const read = await repo.markMessageRead(conversationId, messageId, userId);
  logger.info('Message Read', { messageId, conversationId, userId });
  return read;
};

exports.archiveConversation = async (userId, conversationId, payload) => {
  const conversation = await repo.findConversationForUser(conversationId, userId);
  if (!conversation) throw new ConversationNotFound();

  const updated = await repo.archiveConversation(conversationId, {
    title: payload.title,
    archived: payload.archived === true
  });
  logger.info('Conversation Archived', { conversationId, archivedBy: userId, archived: payload.archived === true });
  return buildConversationDto(updated);
};

exports.getUnreadCount = async (userId, conversationId) => {
  const conversation = await repo.findConversationForUser(conversationId, userId);
  if (!conversation) throw new ConversationNotFound();
  return repo.getUnreadCount(userId, conversationId);
};

exports.getConversationHistory = async (userId, conversationId, pagination) => {
  const conversation = await repo.findConversationForUser(conversationId, userId);
  if (!conversation) throw new ConversationNotFound();

  const messages = await repo.getMessages(conversationId, pagination.limit, pagination.offset);
  return messages.map(buildMessageDto);
};

exports.getConversationById = async (userId, conversationId) => {
  const conversation = await repo.findConversationForUser(conversationId, userId);
  if (!conversation) throw new ConversationNotFound();
  return buildConversationDto(conversation);
};

exports.getConversationMembers = async (userId, conversationId) => {
  const conversation = await repo.findConversationForUser(conversationId, userId);
  if (!conversation) throw new ConversationNotFound();
  return repo.findConversationMembers(conversationId);
};

exports.getConversations = async (userId) => {
  const conversations = await repo.getConversations(userId);
  return conversations.map(buildConversationDto);
};

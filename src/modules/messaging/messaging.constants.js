const ConversationTypes = {
  GROUP: 'GROUP',
  DIRECT: 'DIRECT'
};

const MessageTypes = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  FILE: 'FILE',
  SYSTEM: 'SYSTEM'
};

const Permissions = {
  CONVERSATION_CREATE: 'conversation:create',
  CONVERSATION_VIEW: 'conversation:view',
  CONVERSATION_UPDATE: 'conversation:update',
  CONVERSATION_DELETE: 'conversation:delete',
  CONVERSATION_ADD_MEMBER: 'conversation:add_member',
  CONVERSATION_REMOVE_MEMBER: 'conversation:remove_member',
  MESSAGE_CREATE: 'message:create',
  MESSAGE_VIEW: 'message:view',
  MESSAGE_UPDATE: 'message:update',
  MESSAGE_DELETE: 'message:delete',
  MESSAGE_READ: 'message:read'
};

module.exports = {
  ConversationTypes,
  MessageTypes,
  Permissions
};

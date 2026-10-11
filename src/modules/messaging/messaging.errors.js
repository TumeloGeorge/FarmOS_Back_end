class ApplicationError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ConversationNotFound extends ApplicationError {
  constructor() {
    super('Conversation not found', 404);
  }
}

class ConversationArchived extends ApplicationError {
  constructor() {
    super('Conversation has been archived', 400);
  }
}

class DuplicateConversation extends ApplicationError {
  constructor() {
    super('Duplicate conversation', 409);
  }
}

class AlreadyMember extends ApplicationError {
  constructor() {
    super('User already a conversation member', 409);
  }
}

class NotConversationMember extends ApplicationError {
  constructor() {
    super('User is not a member of this conversation', 403);
  }
}

class MessageDeleted extends ApplicationError {
  constructor() {
    super('Message has been deleted', 404);
  }
}

class CannotEditOthersMessage extends ApplicationError {
  constructor() {
    super('Cannot edit another user\'s message', 403);
  }
}

class CannotDeleteOthersMessage extends ApplicationError {
  constructor() {
    super('Cannot delete another user\'s message', 403);
  }
}

class MessageNotFound extends ApplicationError {
  constructor() {
    super('Message not found', 404);
  }
}

module.exports = {
  ApplicationError,
  ConversationNotFound,
  ConversationArchived,
  DuplicateConversation,
  AlreadyMember,
  NotConversationMember,
  MessageDeleted,
  CannotEditOthersMessage,
  CannotDeleteOthersMessage,
  MessageNotFound
};

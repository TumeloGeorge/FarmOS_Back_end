const repo = require('../modules/messaging/messaging.repository');

module.exports = async (req, res, next) => {
  try {
    let conversationId = req.params.conversationId || req.params.id;
    if (!conversationId) return next();

    if (req.path.startsWith('/messages/') || req.path.includes('/messages/')) {
      const resolvedId = await repo.findConversationIdByMessageId(req.params.id);
      if (resolvedId) {
        conversationId = resolvedId;
      }
    }

    const isMember = await repo.isUserInConversation(conversationId, req.user.user_id);
    if (!isMember) {
      return res.status(403).json({ error: 'User is not a member of this conversation' });
    }

    next();
  } catch (err) {
    next(err);
  }
};

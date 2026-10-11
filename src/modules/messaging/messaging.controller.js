const service = require('./messaging.service');

exports.createConversation = async (req, res, next) => {
  try {
    const conversation = await service.createConversation(req.user.user_id, req.body);
    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await service.getConversations(req.user.user_id);
    res.json(conversations);
  } catch (err) {
    next(err);
  }
};

exports.getConversation = async (req, res, next) => {
  try {
    const conversation = await service.getConversationById(req.user.user_id, req.params.id);
    res.json(conversation);
  } catch (err) {
    next(err);
  }
};

exports.updateConversation = async (req, res, next) => {
  try {
    const updated = await service.archiveConversation(req.user.user_id, req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.archiveConversation = async (req, res, next) => {
  try {
    const archived = await service.archiveConversation(req.user.user_id, req.params.id, { archived: true });
    res.json(archived);
  } catch (err) {
    next(err);
  }
};

exports.getMembers = async (req, res, next) => {
  try {
    const members = await service.getConversationMembers(req.user.user_id, req.params.id);
    res.json(members);
  } catch (err) {
    next(err);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const result = await service.addConversationMember(req.user.user_id, req.params.id, req.body.userId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const result = await service.removeConversationMember(req.user.user_id, req.params.id, req.params.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;
    const history = await service.getConversationHistory(req.user.user_id, req.params.id, { limit, offset });
    res.json(history);
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const message = await service.sendMessage(req.user.user_id, req.params.id, req.body);
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

exports.editMessage = async (req, res, next) => {
  try {
    const message = await service.editMessage(req.user.user_id, req.params.id, req.body);
    res.json(message);
  } catch (err) {
    next(err);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const result = await service.deleteMessage(req.user.user_id, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const result = await service.markAsRead(req.user.user_id, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

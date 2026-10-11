const Joi = require('joi');

const createConversationSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  conversationType: Joi.string().valid('GROUP', 'DIRECT').required(),
  farmId: Joi.string().uuid().required(),
  participantIds: Joi.array().items(Joi.string().uuid()).default([])
});

const updateConversationSchema = Joi.object({
  title: Joi.string().trim().min(1).optional(),
  archived: Joi.boolean().optional()
}).min(1);

const sendMessageSchema = Joi.object({
  body: Joi.string().trim().min(1).required(),
  replyTo: Joi.string().uuid().allow(null),
  messageType: Joi.string().valid('TEXT', 'IMAGE', 'FILE', 'SYSTEM').default('TEXT')
});

const editMessageSchema = Joi.object({
  body: Joi.string().trim().min(1).required()
});

const addMemberSchema = Joi.object({
  userId: Joi.string().uuid().required() });

module.exports = {
  createConversationSchema,
  updateConversationSchema,
  sendMessageSchema,
  editMessageSchema,
  addMemberSchema
};

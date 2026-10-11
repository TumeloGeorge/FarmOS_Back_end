const express = require('express');
const router = express.Router();
const controller = require('./messaging.controller');
const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/rbac.middleware');
const validate = require('../../middleware/validate.middleware');
const checkFarmMembership = require('../../middleware/checkFarmMembership.middleware');
const checkConversationAccess = require('../../middleware/checkConversationAccess.middleware');
const {
  createConversationSchema,
  updateConversationSchema,
  sendMessageSchema,
  editMessageSchema,
  addMemberSchema
} = require('./messaging.validator');

router.post(
  '/conversations',
  auth,
  checkFarmMembership,
  authorize('conversation:create'),
  validate(createConversationSchema),
  controller.createConversation
);

router.get(
  '/conversations',
  auth,
  authorize('conversation:view'),
  controller.getConversations
);

router.get(
  '/conversations/:id',
  auth,
  checkConversationAccess,
  authorize('conversation:view'),
  controller.getConversation
);

router.patch(
  '/conversations/:id',
  auth,
  checkConversationAccess,
  authorize('conversation:update'),
  validate(updateConversationSchema),
  controller.updateConversation
);

router.delete(
  '/conversations/:id',
  auth,
  checkConversationAccess,
  authorize('conversation:delete'),
  controller.archiveConversation
);

router.get(
  '/conversations/:id/members',
  auth,
  checkConversationAccess,
  authorize('conversation:view'),
  controller.getMembers
);

router.post(
  '/conversations/:id/members',
  auth,
  checkConversationAccess,
  authorize('conversation:add_member'),
  validate(addMemberSchema),
  controller.addMember
);

router.delete(
  '/conversations/:id/members/:userId',
  auth,
  checkConversationAccess,
  authorize('conversation:remove_member'),
  controller.removeMember
);

router.get(
  '/conversations/:id/messages',
  auth,
  checkConversationAccess,
  authorize('message:view'),
  controller.getMessages
);

router.post(
  '/conversations/:id/messages',
  auth,
  checkConversationAccess,
  authorize('message:create'),
  validate(sendMessageSchema),
  controller.sendMessage
);

router.patch(
  '/messages/:id',
  auth,
  checkConversationAccess,
  authorize('message:update'),
  validate(editMessageSchema),
  controller.editMessage
);

router.delete(
  '/messages/:id',
  auth,
  checkConversationAccess,
  authorize('message:delete'),
  controller.deleteMessage
);

router.post(
  '/messages/:id/read',
  auth,
  checkConversationAccess,
  authorize('message:read'),
  controller.markRead
);

module.exports = router;

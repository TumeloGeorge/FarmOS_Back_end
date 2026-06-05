const express = require('express');
const router = express.Router();

const controller = require('./farm.controller');
const auth = require('../../middleware/auth.middleware');
const context = require('../../middleware/context.middleware');
const authorize = require('../../middleware/rbac.middleware');

router.post('/', auth, controller.createFarm);

router.get('/', auth, controller.getFarms);

// Membership management (restricted)
router.post(
    '/:id/members',
    auth,
    context,
    authorize('MANAGE_MEMBERS'),
    controller.addMember
);

router.get(
    '/:id/members',
    auth,
    context,
    authorize('MANAGE_MEMBERS'),
    controller.getMembers
);

router.delete(
    '/:id/members/:userId',
    auth,
    context,
    authorize('MANAGE_MEMBERS'),
    controller.removeMember
);

module.exports = router;
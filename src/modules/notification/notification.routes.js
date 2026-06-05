const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth.middleware');
const controller = require('./notification.controller');

router.get('/', auth, controller.getNotifications);
router.patch('/:id/read', auth, controller.markRead);

module.exports = router;

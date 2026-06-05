const express = require('express');
const router = express.Router();

const controller = require('./finance.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/connect', auth, controller.connect);
router.get('/callback', auth, controller.callback);
router.get('/transactions', auth, controller.getTransactions);

module.exports = router;

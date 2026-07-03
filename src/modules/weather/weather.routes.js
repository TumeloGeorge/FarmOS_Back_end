const express = require('express');
const router = express.Router();
const controller = require('./weather.controller');

router.get('/current', controller.getCurrent);

module.exports = router;

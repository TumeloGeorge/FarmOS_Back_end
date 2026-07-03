const express = require('express');
const router = express.Router();

router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/farms', require('../modules/farm/farm.routes'));
router.use('/tasks', require('../modules/task/task.routes'));
router.use('/suggestions', require('../modules/suggestion/suggestion.routes'));
router.use('/notifications', require('../modules/notification/notification.routes'));
router.use('/finance', require('../modules/finance/finance.routes'));
router.use('/weather', require('../modules/weather/weather.routes'));
router.use('/fields', require('../modules/fields/field.routes'));
router.use('/crop-cycles', require('../modules/crop-cycle/cropCycle.routes'));
router.use('/goals', require('../modules/goals/goal.routes'));

module.exports = router;
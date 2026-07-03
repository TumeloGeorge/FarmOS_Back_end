const router = require('express').Router();

const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/rbac.middleware');
const validator = require('./goal.validator');
const controller = require('./goal.controller');

router.post(
  '/goals',
  auth,
  authorize('goal:create'),
  validator.createGoal,
  controller.createGoal
);

router.get(
  '/goals',
  auth,
  authorize('goal:view'),
  controller.getGoals
);

router.get(
  '/goals/:id',
  auth,
  authorize('goal:view'),
  controller.getGoalById
);

router.get(
  '/goals/:id/progress',
  auth,
  authorize('goal:view'),
  controller.getGoalProgress
);

router.delete(
  '/goals/:id',
  auth,
  authorize('goal:delete'),
  controller.deleteGoal
);

module.exports = router;

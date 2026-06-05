const express = require('express');
const router = express.Router();

const controller = require('./task.controller');
const auth = require('../../middleware/auth.middleware');
const context = require('../../middleware/context.middleware');
const authorize = require('../../middleware/rbac.middleware');
const validate = require('../../middleware/validate.middleware');
const { createTaskSchema } = require('./task.validation');

router.post(
    '/',
    auth,
    context,
    authorize('CREATE_TASK'),
    validate(createTaskSchema),
    controller.createTask
);

router.get(
    '/',
    auth,
    context,
    authorize('VIEW_TASK'),
    controller.getTasks
);

router.patch(
    '/:id/status',
    auth,
    context,
    authorize('UPDATE_TASK'),
    controller.updateTaskStatus
);

router.patch(
    '/:id/assign',
    auth,
    context,
    authorize('UPDATE_TASK'),
    controller.assignTask
);

router.delete(
    '/:id',
    auth,
    context,
    authorize('DELETE_TASK'),
    controller.deleteTask
);

router.post(
    '/generate/:cropCycleId',
    auth,
    context,
    authorize('CREATE_TASK'),
    controller.generateTasks
);

module.exports = router;
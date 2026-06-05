const router = require('express').Router();

const auth = require('../../middleware/auth.middleware');
const context = require('../../middleware/context.middleware');
const authorize = require('../../middleware/rbac.middleware');

const controller = require('./suggestion.controller');

// Agronomist
router.post(
    '/',
    auth,
    context,
    authorize('CREATE_SUGGESTION'),
    controller.create
);

// Farmer
router.patch(
    '/:id/review',
    auth,
    context,
    authorize('REVIEW_SUGGESTION'),
    controller.review
);

module.exports = router;
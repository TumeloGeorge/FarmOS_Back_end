const router = require('express').Router();

const auth = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/rbac.middleware');

const controller =
require('./field.controller');

router.post(
  '/farms/:farmId/fields',
  auth,
  authorize('field:create'),
  controller.createField
);

router.get(
  '/farms/:farmId/fields',
  auth,
  authorize('field:view'),
  controller.getFields
);

router.get(
  '/farms/:farmId/fields/testField',
  auth,
  authorize('field:view')
);

router.get(
    '/fields/testField',
    auth
)

module.exports = router;
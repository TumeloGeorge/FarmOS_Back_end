const router = require('express').Router();

const auth = require('../../middleware/auth.middleware');

const authorize =
require('../../middleware/rbac.middleware');

const controller =
require('./cropCycle.controller');

router.post(
  '/fields/:fieldId/crop-cycles',
  auth,
  authorize('cropcycle:create'),
  controller.createCropCycle
);

router.get(
  '/fields/:fieldId/crop-cycles',
  auth,
  authorize('cropcycle:view'),
  controller.getFieldCropCycles
);

module.exports = router;
const controller = require('./messaging.controller');
const service = require('./messaging.service');
const repository = require('./messaging.repository');
const validator = require('./messaging.validator');
const constants = require('./messaging.constants');

module.exports = {
  controller,
  service,
  repository,
  validator,
  constants
};

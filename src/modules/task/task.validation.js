const Joi = require('joi');

exports.createTaskSchema = Joi.object({
    crop_cycle_id: Joi.string().uuid().required(),
    template_id: Joi.string().uuid().optional().allow(null),
    scheduled_date: Joi.date().required(),
    assigned_to: Joi.string().uuid().optional().allow(null)
});

exports.updateTaskSchema = Joi.object({
    status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED'),
    comment: Joi.string().allow('', null)
});
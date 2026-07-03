const Joi = require('joi');

const createGoalSchema = Joi.object({
  farm_id: Joi.string().uuid().required(),
  created_by: Joi.string().uuid().required(),
  goal_type: Joi.string().required(),
  title: Joi.string().min(1).required(),
  description: Joi.string().allow(''),
  target_value: Joi.number().positive().required(),
  unit: Joi.string().allow(''),
  start_date: Joi.date().iso().allow(null),
  target_date: Joi.date().iso().allow(null),
  status: Joi.string().allow('active', 'inactive')
});

exports.createGoal = (req, res, next) => {
  const { error } = createGoalSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  next();
};

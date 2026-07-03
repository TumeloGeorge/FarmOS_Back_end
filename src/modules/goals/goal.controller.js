const service = require('./goal.service');

exports.createGoal = async (req, res, next) => {
  try {
    const goal = await service.createGoal(req.body);
    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
};

exports.getGoals = async (req, res, next) => {
  try {
    const goals = await service.getGoalsByFarm(req.query.farmId);
    res.json(goals);
  } catch (error) {
    next(error);
  }
};

exports.getGoalById = async (req, res, next) => {
  try {
    const goal = await service.getGoalById(req.params.id);
    res.json(goal);
  } catch (error) {
    next(error);
  }
};

exports.getGoalProgress = async (req, res, next) => {
  try {
    const progress = await service.getGoalProgress(req.params.id);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    await service.deleteGoal(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};


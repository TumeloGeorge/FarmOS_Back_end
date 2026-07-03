const repo = require('./goal.repository');

const GoalTypes = {
  REVENUE: 'revenue',
  PROFIT: 'profit',
  YIELD: 'yield',
  COST_REDUCTION: 'cost_reduction',
  TASK_COMPLETION: 'task_completion',
  CUSTOM: 'custom'
};

const toStatus = (percentage) => {
  if (percentage >= 100) return 'ACHIEVED';
  if (percentage >= 80) return 'ON_TRACK';
  if (percentage >= 50) return 'BEHIND';
  return 'AT_RISK';
};

const calculateCurrentValue = async (goal) => {
  switch (goal.goal_type) {
    case GoalTypes.REVENUE:
      return repo.getRevenueValue(goal.farm_id);
    case GoalTypes.PROFIT:
      return repo.getProfitValue(goal.farm_id);
    case GoalTypes.YIELD:
      return repo.getYieldValue(goal.farm_id);
    case GoalTypes.COST_REDUCTION:
      return repo.getExpenseValue(goal.farm_id);
    case GoalTypes.TASK_COMPLETION: {
      const { completed, total } = await repo.getTaskCompletionValue(goal.farm_id);
      return total > 0 ? (completed / total) * 100 : 0;
    }
    case GoalTypes.CUSTOM:
      return 0;
    default:
      return 0;
  }
};

exports.createGoal = async (data) => {
  const payload = {
    farm_id: data.farm_id || data.farmId,
    created_by: data.created_by || data.createdBy,
    goal_type: data.goal_type || data.goalType,
    title: data.title,
    description: data.description || null,
    target_value: Number(data.target_value ?? data.targetValue),
    unit: data.unit || null,
    start_date: data.start_date || data.startDate || null,
    target_date: data.target_date || data.targetDate || null,
    status: data.status || 'active'
  };

  if (!payload.farm_id || !payload.created_by || !payload.goal_type || !payload.title || Number.isNaN(payload.target_value)) {
    throw new Error('Invalid goal payload');
  }

  return repo.createGoal(payload);
};

exports.getGoalsByFarm = async (farmId) => {
  const goals = await repo.getGoalsByFarm(farmId);
  return Promise.all(goals.map((goal) => exports.getGoalProgress(goal.goal_id, goal)));
};

exports.getGoalById = async (goalId) => {
  const goal = await repo.getGoalById(goalId);
  if (!goal) throw new Error('Goal not found');
  return exports.getGoalProgress(goalId, goal);
};

exports.getGoalProgress = async (goalId, existingGoal) => {
  const goal = existingGoal || await repo.getGoalById(goalId);
  if (!goal) throw new Error('Goal not found');

  const currentValue = await calculateCurrentValue(goal);
  const targetValue = Number(goal.target_value || 0);
  const percentage = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;

  return {
    ...goal,
    currentValue: Number(currentValue),
    percentage: Number(percentage.toFixed(2)),
    status: toStatus(percentage)
  };
};

exports.getProgressHistory = async (goalId) => {
  return repo.getProgressHistory(goalId);
};

exports.deleteGoal = async (goalId) => {
  return repo.deleteGoal(goalId);
};
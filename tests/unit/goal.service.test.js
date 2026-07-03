jest.mock('../../src/modules/goals/goal.repository', () => ({
  createGoal: jest.fn(),
  getGoalById: jest.fn(),
  getGoalsByFarm: jest.fn(),
  deleteGoal: jest.fn(),
  getRevenueValue: jest.fn(),
  getProfitValue: jest.fn(),
  getYieldValue: jest.fn(),
  getTaskCompletionValue: jest.fn(),
  getProgressHistory: jest.fn(),
  insertProgress: jest.fn()
}));

const repo = require('../../src/modules/goals/goal.repository');
const service = require('../../src/modules/goals/goal.service');

describe('goal service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a goal with defaults', async () => {
    repo.createGoal.mockResolvedValue({ goal_id: 'goal-1', title: 'Yield goal' });

    const goal = await service.createGoal({
      farm_id: 'farm-1',
      created_by: 'user-1',
      goal_type: 'yield',
      title: 'Yield goal',
      target_value: 100,
      unit: 'kg'
    });

    expect(repo.createGoal).toHaveBeenCalledWith(expect.objectContaining({
      goal_type: 'yield',
      status: 'active',
      title: 'Yield goal',
      target_value: 100
    }));
    expect(goal.title).toBe('Yield goal');
  });

  it('calculates progress and status for revenue goals', async () => {
    repo.getGoalById.mockResolvedValue({
      goal_id: 'goal-1',
      farm_id: 'farm-1',
      goal_type: 'revenue',
      target_value: 100,
      unit: 'bwp'
    });
    repo.getRevenueValue.mockResolvedValue(80);

    const result = await service.getGoalProgress('goal-1');

    expect(result.currentValue).toBe(80);
    expect(result.percentage).toBe(80);
    expect(result.status).toBe('ON_TRACK');
  });

  it('deletes a goal', async () => {
    await service.deleteGoal('goal-1');

    expect(repo.deleteGoal).toHaveBeenCalledWith('goal-1');
  });
});

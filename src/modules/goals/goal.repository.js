const db = require('../../db');

exports.createGoal = async (data) => {
  const result = await db.query(
    `
    INSERT INTO goals (
      goal_id,
      farm_id,
      created_by,
      goal_type,
      title,
      description,
      target_value,
      unit,
      start_date,
      target_date,
      status,
      created_at
    )
    VALUES (
      gen_random_uuid(),
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
    )
    RETURNING *
    `,
    [
      data.farm_id,
      data.created_by,
      data.goal_type,
      data.title,
      data.description || null,
      data.target_value,
      data.unit || null,
      data.start_date || null,
      data.target_date || null,
      data.status || 'active'
    ]
  );

  return result.rows[0];
};

exports.getGoalsByFarm = async (farmId) => {
  const result = await db.query(
    `
    SELECT *
    FROM goals
    WHERE farm_id = $1
    ORDER BY created_at DESC
    `,
    [farmId]
  );

  return result.rows;
};

exports.getGoalById = async (goalId) => {
  const result = await db.query(
    `
    SELECT *
    FROM goals
    WHERE goal_id = $1
    `,
    [goalId]
  );

  return result.rows[0];
};

exports.deleteGoal = async (goalId) => {
  await db.query(
    `
    DELETE FROM goals
    WHERE goal_id = $1
    `,
    [goalId]
  );
};

exports.insertProgress = async (goalId, amount, note, updatedBy) => {
  const goal = await exports.getGoalById(goalId);
  if (!goal) {
    throw new Error('Goal not found');
  }

  const result = await db.query(
    `
    INSERT INTO goal_progress (
      progress_id,
      goal_id,
      old_value,
      new_value,
      note,
      updated_by,
      created_at
    )
    VALUES (
      gen_random_uuid(),
      $1, $2, $3, $4, $5, NOW()
    )
    RETURNING *
    `,
    [goalId, 0, amount, note || null, updatedBy || null]
  );

  return result.rows[0];
};

exports.getProgressHistory = async (goalId) => {
  const result = await db.query(
    `
    SELECT *
    FROM goal_progress
    WHERE goal_id = $1
    ORDER BY created_at DESC
    `,
    [goalId]
  );

  return result.rows;
};

exports.getRevenueValue = async (farmId) => {
  const result = await db.query(
    `
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM transactions
    WHERE farm_id = $1
      AND type = 'income'
    `,
    [farmId]
  );

  return Number(result.rows[0]?.total || 0);
};

exports.getProfitValue = async (farmId) => {
  const result = await db.query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income_total,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense_total
    FROM transactions
    WHERE farm_id = $1
    `,
    [farmId]
  );

  const row = result.rows[0] || {};
  return Number(row.income_total || 0) - Number(row.expense_total || 0);
};

exports.getExpenseValue = async (farmId) => {
  const result = await db.query(
    `
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM transactions
    WHERE farm_id = $1
      AND type = 'expense'
    `,
    [farmId]
  );

  return Number(result.rows[0]?.total || 0);
};

exports.getYieldValue = async (farmId) => {
  const result = await db.query(
    `
    SELECT COALESCE(SUM(actual_yield), 0) AS total
    FROM crop_cycles
    WHERE farm_id = $1
    `,
    [farmId]
  );

  return Number(result.rows[0]?.total || 0);
};

exports.getTaskCompletionValue = async (farmId) => {
  const result = await db.query(
    `
    SELECT
      COUNT(*) FILTER (WHERE t.status = 'COMPLETED')::numeric AS completed,
      COUNT(*)::numeric AS total
    FROM tasks t
    JOIN crop_cycles cc ON cc.crop_cycle_id = t.crop_cycle_id
    WHERE cc.farm_id = $1
    `,
    [farmId]
  );

  const row = result.rows[0] || {};
  return {
    completed: Number(row.completed || 0),
    total: Number(row.total || 0)
  };
};
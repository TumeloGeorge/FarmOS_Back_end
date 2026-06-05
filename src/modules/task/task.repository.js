const db = require('../../db');

exports.createTask = async (data) => {
    const result = await db.query(
        `INSERT INTO tasks (task_id, crop_cycle_id, template_id, scheduled_date, status, assigned_to)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [data.task_id, data.crop_cycle_id, data.template_id, data.scheduled_date, data.status, data.assigned_to]
    );
    return result.rows[0];
};

exports.getTasks = async () => {
    return db.query(`SELECT * FROM tasks`);
};

exports.getTaskById = async (taskId) => {
    const result = await db.query(
        `SELECT * FROM tasks WHERE task_id = $1`,
        [taskId]
    );
    return result.rows[0];
};

exports.getTaskOwnerId = async (taskId) => {
    return db.query(
        `SELECT f.owner_id
         FROM tasks t
         JOIN crop_cycles cc ON t.crop_cycle_id = cc.crop_cycle_id
         JOIN fields fi ON cc.field_id = fi.field_id
         JOIN farms f ON fi.farm_id = f.farm_id
         WHERE t.task_id = $1`,
        [taskId]
    );
};

exports.updateTask = async (taskId, update) => {
    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const key in update) {
        setClauses.push(`${key} = $${idx}`);
        values.push(update[key]);
        idx += 1;
    }

    values.push(taskId);
    const query = `UPDATE tasks SET ${setClauses.join(', ')} WHERE task_id = $${idx}`;
    return db.query(query, values);
};

exports.logTaskUpdate = async ({ taskId, userId, status, comment }) => {
    return db.query(
        `INSERT INTO task_updates (update_id, task_id, user_id, status, comment)
         VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
        [taskId, userId, status, comment]
    );
};

exports.deleteTask = async (taskId) => {
    return db.query(
        `DELETE FROM tasks WHERE task_id = $1`,
        [taskId]
    );
};

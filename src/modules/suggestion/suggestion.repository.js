const db = require('../../db');

exports.createSuggestion = (data) => {
    return db.query(
        `INSERT INTO task_suggestions 
        (suggestion_id, task_id, suggested_by, suggested_changes)
        VALUES (gen_random_uuid(), $1, $2, $3)
        RETURNING *`,
        [data.task_id, data.user_id, data.changes]
    );
};

exports.getSuggestionsByFarm = (farmId) => {
    return db.query(
        `SELECT ts.*
         FROM task_suggestions ts
         JOIN tasks t ON ts.task_id = t.task_id
         JOIN crop_cycles cc ON t.crop_cycle_id = cc.crop_cycle_id
         JOIN fields f ON cc.field_id = f.field_id
         WHERE f.farm_id = $1`,
        [farmId]
    );
};

exports.updateSuggestionStatus = (id, status) => {
    return db.query(
        `UPDATE task_suggestions SET status = $1 WHERE suggestion_id = $2`,
        [status, id]
    );
};

exports.getSuggestionById = (id) => {
    return db.query(
        `SELECT * FROM task_suggestions WHERE suggestion_id = $1`,
        [id]
    );
};
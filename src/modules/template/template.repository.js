const db = require('../../db');

exports.getTemplates = async (cropType, stage) => {
    return db.query(
        `SELECT * FROM task_templates
         WHERE crop_type = $1 AND stage = $2
         ORDER BY day_offset ASC`,
        [cropType, stage]
    );
};

exports.getTemplateById = async (templateId) => {
    const result = await db.query(
        `SELECT * FROM task_templates WHERE template_id = $1`,
        [templateId]
    );
    return result.rows[0];
};

exports.createTemplate = async (data) => {
    const result = await db.query(
        `INSERT INTO task_templates (template_id, crop_type, stage, task_type, day_offset, description)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [data.template_id, data.crop_type, data.stage, data.task_type, data.day_offset, data.description]
    );
    return result.rows[0];
};

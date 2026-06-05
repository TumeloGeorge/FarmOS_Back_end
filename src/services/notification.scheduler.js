const cron = require('node-cron');
const db = require('../db');
const notify = require('../modules/notification/notification.service');

cron.schedule('0 6 * * *', async () => {
    try {
        const result = await db.query(`
            SELECT t.task_id, t.assigned_to
            FROM tasks t
            WHERE t.status = 'PENDING'
              AND t.scheduled_date = CURRENT_DATE
              AND t.assigned_to IS NOT NULL
        `);

        for (const task of result.rows) {
            await notify.notify(
                task.assigned_to,
                'Task Reminder',
                'You have a task due today.',
                'TASK'
            );
        }
    } catch (err) {
        console.error('Notification scheduler failed', err.message || err);
    }
});

const db = require('../../db');

exports.create = (data) => {
    return db.query(
        `INSERT INTO notifications
         (notification_id, user_id, title, message, type)
         VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
        [data.user_id, data.title, data.message, data.type]
    );
};

exports.getUserNotifications = (userId) => {
    return db.query(
        `SELECT * FROM notifications
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
    );
};

exports.markAsRead = (id) => {
    return db.query(
        `UPDATE notifications SET is_read = TRUE WHERE notification_id = $1`,
        [id]
    );
};

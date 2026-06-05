const repo = require('./notification.repository');

exports.notify = async (userId, title, message, type) => {
    await repo.create({
        user_id: userId,
        title,
        message,
        type
    });
};

exports.getUserNotifications = async (userId) => {
    const result = await repo.getUserNotifications(userId);
    return result.rows;
};

exports.markAsRead = async (id) => {
    return repo.markAsRead(id);
};

const service = require('./notification.service');

exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await service.getUserNotifications(req.user.user_id);
        res.json(notifications);
    } catch (err) {
        next(err);
    }
};

exports.markRead = async (req, res, next) => {
    try {
        await service.markAsRead(req.params.id);
        res.json({ message: 'Marked as read' });
    } catch (err) {
        next(err);
    }
};

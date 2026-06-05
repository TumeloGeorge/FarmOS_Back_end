const service = require('./suggestion.service');

exports.create = async (req, res, next) => {
    try {
        const result = await service.createSuggestion({
            task_id: req.body.task_id,
            user_id: req.user.user_id,
            changes: req.body.changes
        });
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.review = async (req, res, next) => {
    try {
        await service.reviewSuggestion(
            req.params.id,
            req.body.decision
        );
        res.json({ message: 'Reviewed' });
    } catch (err) {
        next(err);
    }
};
const repo = require('./suggestion.repository');
const taskRepo = require('../task/task.repository');
const notify = require('../notification/notification.service');

exports.createSuggestion = async (data) => {
    const result = await repo.createSuggestion(data);
    const suggestion = result.rows[0];

    const ownerResult = await taskRepo.getTaskOwnerId(data.task_id);
    const ownerId = ownerResult.rows?.[0]?.owner_id;

    if (ownerId) {
        await notify.notify(
            ownerId,
            'New Suggestion',
            'An agronomist has suggested a task update.',
            'SUGGESTION'
        );
    }

    return suggestion;
};

exports.reviewSuggestion = async (id, decision) => {

    const suggestion = (await repo.getSuggestionById(id)).rows[0];
    if (!suggestion) throw new Error('Suggestion not found');

    if (decision === 'ACCEPTED') {

        const changes = suggestion.suggested_changes;

        await taskRepo.updateTask(suggestion.task_id, changes);
    }

    await repo.updateSuggestionStatus(id, decision);

    await notify.notify(
        suggestion.suggested_by,
        'Suggestion Reviewed',
        `Your suggestion has been ${decision.toLowerCase()}.`,
        'SUGGESTION'
    );
};
const { v4: uuidv4 } = require('uuid');
const repo = require('./task.repository');
const notify = require('../notification/notification.service');

exports.createTask = async (data) => {
    return repo.createTask({
        task_id: uuidv4(),
        crop_cycle_id: data.crop_cycle_id,
        template_id: data.template_id || null,
        scheduled_date: data.scheduled_date || null,
        status: data.status || 'PENDING',
        assigned_to: data.assigned_to || null
    });
};

exports.getTasks = async () => {
    const result = await repo.getTasks();
    return result.rows;
};

exports.updateTaskStatus = async (taskId, userId, { status, comment }) => {
    const task = await repo.getTaskById(taskId);
    if (!task) throw new Error('Task not found');

    await repo.updateTask(taskId, { status });

    await repo.logTaskUpdate({
        taskId,
        userId,
        status,
        comment
    });

    if (status === 'COMPLETED') {
        const ownerResult = await repo.getTaskOwnerId(taskId);
        const ownerId = ownerResult.rows?.[0]?.owner_id;
        if (ownerId) {
            await notify.notify(
                ownerId,
                'Task Completed',
                'A task has been completed and is ready for review.',
                'TASK'
            );
        }
    }
};

exports.assignTask = async (taskId, assigned_to) => {
    const task = await repo.getTaskById(taskId);
    if (!task) throw new Error('Task not found');

    await repo.updateTask(taskId, { assigned_to });

    if (assigned_to) {
        await notify.notify(
            assigned_to,
            'New Task Assigned',
            'You have been assigned a new task.',
            'TASK'
        );
    }

    return await repo.getTaskById(taskId);
};

exports.deleteTask = async (taskId) => {
    return repo.deleteTask(taskId);
};
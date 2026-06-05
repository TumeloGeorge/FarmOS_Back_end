const service = require('./task.service');
const generator = require('../../services/task.generator.service');

exports.createTask = async (req, res, next) => {
    try {
        const task = await service.createTask(req.body);
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
};

exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await service.getTasks();
        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

exports.updateTaskStatus = async (req, res, next) => {
    try {
        await service.updateTaskStatus(
            req.params.id,
            req.user.user_id,
            req.body
        );
        res.json({ message: 'Task updated' });
    } catch (err) {
        next(err);
    }
};

exports.assignTask = async (req, res, next) => {
    try {
        await service.assignTask(req.params.id, req.body.assigned_to);
        res.json({ message: 'Task assigned' });
    } catch (err) {
        next(err);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        await service.deleteTask(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        next(err);
    }
};

exports.generateTasks = async (req, res, next) => {
    try {
        const cropCycle = {
            crop_cycle_id: req.params.cropCycleId,
            crop_type: req.body.crop_type,
            current_stage: req.body.stage,
            planting_date: req.body.planting_date
        };

        const tasks = await generator.generateTasks(cropCycle);

        res.json(tasks);
    } catch (err) {
        next(err);
    }
};
const { v4: uuidv4 } = require('uuid');
const templateRepo = require('../modules/template/template.repository');
const taskRepo = require('../modules/task/task.repository');

exports.generateTasks = async (cropCycle) => {
    // Fetch templates for this crop type and stage
    const result = await templateRepo.getTemplates(
        cropCycle.crop_type,
        cropCycle.current_stage
    );

    const templates = result.rows;
    const tasks = [];

    for (const template of templates) {
        // Calculate scheduled date: planting_date + day_offset
        const scheduledDate = new Date(cropCycle.planting_date);
        scheduledDate.setDate(
            scheduledDate.getDate() + template.day_offset
        );

        // Create task from template
        const task = await taskRepo.createTask({
            task_id: uuidv4(),
            crop_cycle_id: cropCycle.crop_cycle_id,
            template_id: template.template_id,
            scheduled_date: scheduledDate.toISOString().split('T')[0],
            status: 'PENDING',
            assigned_to: null
        });

        tasks.push(task);
    }

    return tasks;
};

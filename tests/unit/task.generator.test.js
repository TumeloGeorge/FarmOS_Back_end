const generator = require('../../src/services/task.generator.service');
const templateRepo = require('../../src/modules/template/template.repository');
const taskRepo = require('../../src/modules/task/task.repository');

jest.mock('../../src/modules/template/template.repository');
jest.mock('../../src/modules/task/task.repository');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Task Generator Service', () => {

    it('should generate tasks from templates', async () => {
        // Mock template response
        templateRepo.getTemplates.mockResolvedValue({
            rows: [
                { template_id: '1', crop_type: 'Maize', stage: 'VEGETATIVE', task_type: 'Watering', day_offset: 3 },
                { template_id: '2', crop_type: 'Maize', stage: 'VEGETATIVE', task_type: 'Fertilize', day_offset: 7 }
            ]
        });

        // Mock task creation
        taskRepo.createTask.mockResolvedValueOnce({ task_id: 'task1', task_type: 'Watering' });
        taskRepo.createTask.mockResolvedValueOnce({ task_id: 'task2', task_type: 'Fertilize' });

        const result = await generator.generateTasks({
            crop_cycle_id: 'cycle1',
            crop_type: 'Maize',
            current_stage: 'VEGETATIVE',
            planting_date: '2025-01-01'
        });

        expect(result).toHaveLength(2);
        expect(result[0].task_type).toBe('Watering');
        expect(result[1].task_type).toBe('Fertilize');
        expect(taskRepo.createTask).toHaveBeenCalledTimes(2);
    });

    it('should calculate scheduled dates based on day offset', async () => {
        templateRepo.getTemplates.mockResolvedValue({
            rows: [
                { template_id: '1', task_type: 'Watering', day_offset: 5 }
            ]
        });

        taskRepo.createTask.mockResolvedValueOnce({ task_id: 'task1' });

        await generator.generateTasks({
            crop_cycle_id: 'cycle1',
            crop_type: 'Maize',
            current_stage: 'VEGETATIVE',
            planting_date: '2025-01-01'
        });

        const callArgs = taskRepo.createTask.mock.calls[0][0];
        expect(callArgs.scheduled_date).toBe('2025-01-06');
    });

    it('should return empty array if no templates found', async () => {
        templateRepo.getTemplates.mockResolvedValue({ rows: [] });

        const result = await generator.generateTasks({
            crop_cycle_id: 'cycle1',
            crop_type: 'Unknown',
            current_stage: 'UNKNOWN',
            planting_date: '2025-01-01'
        });

        expect(result).toHaveLength(0);
    });

});

const service = require('../../src/modules/task/task.service');
const repo = require('../../src/modules/task/task.repository');

jest.mock('../../src/modules/task/task.repository');

describe('Task Service', () => {

    it('should create a task', async () => {
        repo.createTask.mockResolvedValue({ task_id: '1' });

        const result = await service.createTask({
            crop_cycle_id: 'c1'
        });

        expect(result.task_id).toBe('1');
    });

    it('should update task status and log update', async () => {
        repo.getTaskById.mockResolvedValue({ task_id: '1' });

        await service.updateTaskStatus('1', 'user1', {
            status: 'COMPLETED',
            comment: 'Done'
        });

        expect(repo.updateTask).toHaveBeenCalled();
        expect(repo.logTaskUpdate).toHaveBeenCalled();
    });

    it('should throw if task not found', async () => {
        repo.getTaskById.mockResolvedValue(null);

        await expect(
            service.updateTaskStatus('1', 'user1', { status: 'DONE' })
        ).rejects.toThrow('Task not found');
    });
});
const service = require('../../src/modules/farm/farm.service');
const repo = require('../../src/modules/farm/farm.repository');

jest.mock('../../src/modules/farm/farm.repository');

describe('Farm Service', () => {

    it('should create farm and assign farmer role', async () => {

        repo.createFarm.mockResolvedValue({ farm_id: '1' });
        repo.getRoleIdByName.mockResolvedValue('role123');
        repo.addMembership.mockResolvedValue();

        const result = await service.createFarm('user1', {
            name: 'Test Farm'
        });

        expect(repo.addMembership).toHaveBeenCalled();
    });

});
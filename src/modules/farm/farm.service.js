const repo = require('./farm.repository');

exports.createFarm = async (userId, data) => {
    const farm = await repo.createFarm(userId, data);

    // Assign creator as FARMER
    const roleId = await repo.getRoleIdByName('FARMER');

await repo.addMembership(userId, farm.farm_id, roleId);

};

exports.getUserFarms = async (userId) => {
    return repo.getUserFarms(userId);
};

exports.addMember = async (farmId, { user_id, role }) => {
    const roleId = await repo.getRoleIdByName(role);

    if (!roleId) throw new Error('Invalid role');

    await repo.addMembership(user_id, farmId, roleId);
};

exports.getFarmMembers = async (farmId) => {
    return repo.getFarmMembers(farmId);
};

exports.removeMember = async (farmId, userId) => {
    return repo.removeMember(userId, farmId);
};
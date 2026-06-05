const db = require('../../db');

exports.createFarm = async (ownerId, data) => {
    const result = await db.query(
        `INSERT INTO farms (farm_id, owner_id, name, location)
         VALUES (gen_random_uuid(), $1, $2, $3)
         RETURNING *`,
        [ownerId, data.name, data.location]
    );
    return result.rows[0];
};

exports.addMembership = async (userId, farmId, roleId) => {
    return db.query(
        `INSERT INTO farm_memberships (membership_id, user_id, farm_id, role_id)
         VALUES (gen_random_uuid(), $1, $2, $3)
         ON CONFLICT (user_id, farm_id) DO UPDATE SET role_id = $3`,
        [userId, farmId, roleId]
    );
};

exports.getUserFarms = async (userId) => {
    return db.query(
        `SELECT f.*
         FROM farms f
         JOIN farm_memberships fm ON f.farm_id = fm.farm_id
         WHERE fm.user_id = $1`,
        [userId]
    );
};

exports.getFarmMembers = async (farmId) => {
    return db.query(
        `SELECT u.user_id, u.full_name, r.role_name
         FROM farm_memberships fm
         JOIN users u ON fm.user_id = u.user_id
         JOIN roles r ON fm.role_id = r.role_id
         WHERE fm.farm_id = $1`,
        [farmId]
    );
};

exports.removeMember = async (userId, farmId) => {
    return db.query(
        `DELETE FROM farm_memberships
         WHERE user_id = $1 AND farm_id = $2`,
        [userId, farmId]
    );
};

exports.getRoleIdByName = async (roleName) => {
    const result = await db.query(
        `SELECT role_id FROM roles WHERE role_name = $1`,
        [roleName]
    );
    return result.rows[0]?.role_id;
};
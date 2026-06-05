const db = require('../index');

const roles = [
    'FARMER',
    'WORKER',
    'AGRONOMIST',
    'ADMIN'
];

const permissions = [
    'CREATE_TASK',
    'VIEW_TASK',
    'UPDATE_TASK',
    'DELETE_TASK',

    'MANAGE_MEMBERS',
    'MANAGE_FARM',

    'CREATE_SUGGESTION',
    'REVIEW_SUGGESTION',

    'CREATE_TRANSACTION',
    'VIEW_FINANCIALS',

    'MANAGE_SYSTEM'
];

// Explicit role-permission mapping
const rolePermissionsMap = {
    FARMER: [
        'CREATE_TASK',
        'VIEW_TASK',
        'UPDATE_TASK',
        'DELETE_TASK',
        'MANAGE_MEMBERS',
        'MANAGE_FARM',
        'CREATE_TRANSACTION',
        'VIEW_FINANCIALS'
    ],

    WORKER: [
        'VIEW_TASK',
        'UPDATE_TASK'
    ],

    AGRONOMIST: [
        'VIEW_TASK',
        'CREATE_SUGGESTION',
        'REVIEW_SUGGESTION'
    ],

    ADMIN: permissions // full access
};

async function seedRBAC() {
    console.log('🌱 Seeding RBAC...');

    // Insert roles
    for (const role of roles) {
        await db.query(
            `INSERT INTO roles (role_name)
             VALUES ($1)
             ON CONFLICT (role_name) DO NOTHING`,
            [role]
        );
    }

    // Insert permissions
    for (const perm of permissions) {
        await db.query(
            `INSERT INTO permissions (name)
             VALUES ($1)
             ON CONFLICT (name) DO NOTHING`,
            [perm]
        );
    }

    // Map roles → permissions
    for (const roleName in rolePermissionsMap) {

        const roleRes = await db.query(
            `SELECT role_id FROM roles WHERE role_name = $1`,
            [roleName]
        );

        const roleId = roleRes.rows[0].role_id;

        for (const permName of rolePermissionsMap[roleName]) {

            const permRes = await db.query(
                `SELECT permission_id FROM permissions WHERE name = $1`,
                [permName]
            );

            const permId = permRes.rows[0].permission_id;

            await db.query(
                `INSERT INTO role_permissions (role_id, permission_id)
                 VALUES ($1, $2)
                 ON CONFLICT DO NOTHING`,
                [roleId, permId]
            );
        }
    }

    console.log('✅ RBAC Seeding Complete');
}

module.exports = seedRBAC;
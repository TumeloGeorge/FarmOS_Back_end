const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/db');

// Mock RBAC for testing
jest.mock('../../src/middleware/rbac.middleware', () => {
    return () => (req, res, next) => next();
});

// Mock auth
jest.mock('../../src/middleware/auth.middleware', () => {
    return (req, res, next) => {
        req.user = { user_id: 'test-user' };
        next();
    };
});

// Mock context
jest.mock('../../src/middleware/context.middleware', () => {
    return (req, res, next) => {
        req.farmId = 'farm1';
        next();
    };
});

let cropCycleId;

beforeAll(async () => {
    await db.query('BEGIN');
    const result = await db.query(`
        INSERT INTO crop_cycles (crop_cycle_id, crop_type)
        VALUES (gen_random_uuid(), 'Maize')
        RETURNING crop_cycle_id
    `);
    cropCycleId = result.rows[0].crop_cycle_id;
});

afterAll(async () => {
    await db.query('ROLLBACK');
});

describe('Task Routes', () => {

    it('should create task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                crop_cycle_id: cropCycleId,
                scheduled_date: '2025-01-01'
            });

        expect(res.statusCode).toBe(201);
    });

    it('should fetch tasks', async () => {
        const res = await request(app)
            .get('/api/tasks');

        expect(res.statusCode).toBe(200);
    });

});
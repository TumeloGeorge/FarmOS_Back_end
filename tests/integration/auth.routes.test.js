const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/db');

beforeAll(async () => {
    await db.query('BEGIN');
});

afterAll(async () => {
    await db.query('ROLLBACK');
});

describe('Auth Routes', () => {
    it('should register a user', async () => {
        const email = `test+register+${Date.now()}@test.com`;

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                full_name: 'Test User',
                email,
                password: '123456'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.email).toBe(email);
    });

    it('should login user', async () => {
        const email = `test+login+${Date.now()}@test.com`;
        const password = '123456';

        await request(app)
            .post('/api/auth/register')
            .send({
                full_name: 'Login User',
                email,
                password
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email,
                password
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });
});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authService = require('../../src/modules/auth/auth.service');
const repo = require('../../src/modules/auth/auth.repository');

// Mock repository
jest.mock('../../src/modules/auth/auth.repository');

describe('Auth Service - Register', () => {

    it('should register a new user', async () => {

        repo.findUserByEmail.mockResolvedValue(null);

        repo.createUser.mockResolvedValue({
            user_id: '123',
            email: 'test@test.com'
        });

        const result = await authService.register({
            full_name: 'Test User',
            email: 'test@test.com',
            password: '123456'
        });

        expect(result.email).toBe('test@test.com');
        expect(repo.createUser).toHaveBeenCalled();
    });

    it('should throw error if user exists', async () => {

        repo.findUserByEmail.mockResolvedValue({ email: 'test@test.com' });

        await expect(
            authService.register({
                full_name: 'Test',
                email: 'test@test.com',
                password: '123'
            })
        ).rejects.toThrow('User already exists');
    });
});
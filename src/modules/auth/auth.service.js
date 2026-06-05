const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const repo = require('./auth.repository');

const SALT_ROUNDS = 10;

exports.register = async ({ full_name, email, password }) => {
    // Check if user exists
    const existingUser = await repo.findUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await repo.createUser({
        full_name,
        email,
        password_hash
    });

    return user;
};

exports.login = async ({ email, password }) => {
    const user = await repo.findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid credentials');
    }

    if (!user.password_hash) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
        token,
        user: {
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email
        }
    };
};
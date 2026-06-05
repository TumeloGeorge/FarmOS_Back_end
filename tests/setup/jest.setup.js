const path = require('path');
const dotenv = require('dotenv');

// Load test-specific env first, fallback to default .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
process.env.PG_SSL = process.env.PG_SSL || 'false';
process.env.PG_SSL_REJECT_UNAUTHORIZED = process.env.PG_SSL_REJECT_UNAUTHORIZED || 'false';

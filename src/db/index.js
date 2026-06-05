/*
* Name: DB.js
* Description: Database connection setup using PostgreSQL.
* Author: Tumelo George
* Date: November 22, 2026
*/
const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
const logger = require('../utils/logger');

const envPath = path.resolve(__dirname, '..', '..', process.env.NODE_ENV === 'test' ? '.env.test' : '.env');
dotenv.config({ path: envPath });

const sanitize = (value) => {
  if (value === undefined || value === null) return undefined;
  return value.toString().trim().replace(/,\s*$/, '');
};

const dbUser = sanitize(process.env.PG_USER);
const dbPassword = sanitize(process.env.PG_PASSWORD);
const dbHost = sanitize(process.env.PG_HOST);
const dbName = sanitize(process.env.PG_DATABASE);
const dbPort = sanitize(process.env.PG_PORT);
const dbSsl = sanitize(process.env.PG_SSL);
const dbSslRejectUnauthorized = sanitize(process.env.PG_SSL_REJECT_UNAUTHORIZED);

// verify env variables
if (!process.env.PG_USER || !process.env.PG_PASSWORD || !process.env.PG_HOST || !process.env.PG_DATABASE) {
  console.error('❌ Missing required database environment variables. Please check your .env file. ' + process.env.PG_PASSWORD);  console.error('PG_USER:', process.env.PG_USER);
  console.error('PG_PASSWORD:', !!process.env.PG_PASSWORD);
  console.error('PG_HOST:', process.env.PG_HOST);
  console.error('PG_DATABASE:', process.env.PG_DATABASE);  process.exit(1);
}


class Database {
  constructor() {
    this.pool = new Pool({
      user: dbUser,
      host: dbHost,
      database: dbName,
      password: dbPassword,
      port: dbPort,
      ssl: dbSsl === 'true' ? { rejectUnauthorized: false } : false
    });
  }  

  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;

      logger.info('Executed query', {
        text,
        duration,
        rows: res?.rowCount
      });

      return res;
    } catch (err) {
      logger.error('Query failed', {
        text,
        error: err.message
      });
      throw err;
    }
  }
}

module.exports = new Database();

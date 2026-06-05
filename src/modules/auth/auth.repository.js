const db = require('../../db');

exports.createUser = async ({ full_name, email, password_hash }) => {
    const result = await db.query(
        `INSERT INTO users (full_name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING user_id, full_name, email`,
        [full_name, email, password_hash]
    );
    return result.rows[0];
};

exports.findUserByEmail = async (email) => {
    const result = await db.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0];
};